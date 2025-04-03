import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    // Try to get NextAuth session first
    const session = await getServerSession(authOptions)
    let userId = session?.user?.id
    let userRole = session?.user?.role

    // If no NextAuth session, check for Firebase auth token in headers
    if (!session) {
      const authHeader = request.headers.get("authorization")
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7)
        // For Firebase auth, we'll use the token directly
        userId = "firebase-user" // Placeholder, replace with actual user ID if available
        userRole = "admin" // Assuming admin role for Firebase auth users in admin dashboard
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get("userId") || userId
    const doctorId = searchParams.get("doctorId")
    const status = searchParams.get("status")

    // Only allow admins and hospital staff to view other users' appointments
    if (requestedUserId !== userId && userRole !== "admin" && userRole !== "hospital") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("aeternum")

    const query: any = {}

    // For doctors, show only their appointments
    if (userRole === "doctor") {
      query.doctorId = userId
    }
    // For patients, show only their appointments
    else if (userRole === "patient") {
      query.patientId = userId
    }
    // For admins/hospital staff, filter by userId if provided
    else if (requestedUserId) {
      query.patientId = requestedUserId
    }

    // Additional filters
    if (doctorId) {
      query.doctorId = doctorId
    }

    if (status) {
      query.status = status
    }

    const appointments = await db.collection("appointments").find(query).sort({ date: -1 }).toArray()

    // Populate doctor details if needed
    if (appointments.length > 0) {
      const doctorIds = [...new Set(appointments.map((apt) => apt.doctorId))].filter((id) => id)

      if (doctorIds.length > 0) {
        const doctors = await db
          .collection("doctors")
          .find({
            _id: { $in: doctorIds.map((id) => new ObjectId(id)) },
          })
          .toArray()

        const doctorsMap: Record<string, (typeof doctors)[0]> = doctors.reduce(
          (map, doctor) => {
            map[doctor._id.toString()] = doctor
            return map
          },
          {} as Record<string, (typeof doctors)[0]>,
        )

        appointments.forEach((apt) => {
          if (apt.doctorId && doctorsMap[apt.doctorId]) {
            apt.doctor = doctorsMap[apt.doctorId]
          }
        })
      }
    }

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Try to get NextAuth session first
    const session = await getServerSession(authOptions)
    let userId = session?.user?.id
    let userRole = session?.user?.role

    // If no NextAuth session, check for Firebase auth token in headers
    if (!session) {
      const authHeader = request.headers.get("authorization")
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7)
        // For Firebase auth, we'll use the token directly
        userId = "firebase-user" // Placeholder, replace with actual user ID if available
        userRole = "admin" // Assuming admin role for Firebase auth users in admin dashboard
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const data = await request.json()

    // Validate required fields
    if (!data.doctorId || !data.date || !data.time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("aeternum")

    // Check if appointment slot is available
    const existingAppointment = await db.collection("appointments").findOne({
      doctorId: data.doctorId,
      date: data.date,
      time: data.time,
      status: { $ne: "cancelled" },
    })

    if (existingAppointment) {
      return NextResponse.json({ error: "Appointment slot is already booked" }, { status: 409 })
    }

    // Create new appointment
    const appointment = {
      patientId: data.patientId || userId,
      doctorId: data.doctorId,
      date: data.date,
      time: data.time,
      status: "confirmed",
      paymentStatus: data.paymentStatus || "pending",
      paymentMethod: data.paymentMethod,
      transactionHash: data.transactionHash,
      createdAt: new Date(),
    }

    const result = await db.collection("appointments").insertOne(appointment)

    // Get doctor details
    const doctor = await db.collection("doctors").findOne({ _id: new ObjectId(data.doctorId) })

    return NextResponse.json(
      {
        id: result.insertedId,
        ...appointment,
        doctor,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    // Try to get NextAuth session first
    const session = await getServerSession(authOptions)
    let userId = session?.user?.id
    let userRole = session?.user?.role

    // If no NextAuth session, check for Firebase auth token in headers
    if (!session) {
      const authHeader = request.headers.get("authorization")
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7)
        // For Firebase auth, we'll use the token directly
        userId = "firebase-user" // Placeholder, replace with actual user ID if available
        userRole = "admin" // Assuming admin role for Firebase auth users in admin dashboard
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const data = await request.json()

    // Validate required fields
    if (!data.id) {
      return NextResponse.json({ error: "Missing appointment ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("aeternum")

    // Get the appointment
    const appointment = await db.collection("appointments").findOne({
      _id: new ObjectId(data.id),
    })

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Check authorization - only the patient, the doctor, or admin/hospital staff can update
    if (
      appointment.patientId !== userId &&
      appointment.doctorId !== userId &&
      userRole !== "admin" &&
      userRole !== "hospital"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update fields
    const updateData: any = {}

    if (data.status) updateData.status = data.status
    if (data.paymentStatus) updateData.paymentStatus = data.paymentStatus
    if (data.paymentMethod) updateData.paymentMethod = data.paymentMethod
    if (data.transactionHash) updateData.transactionHash = data.transactionHash
    if (data.notes) updateData.notes = data.notes

    // Only allow rescheduling if explicitly provided and not completed/cancelled
    if (data.date && data.time && appointment.status !== "completed" && appointment.status !== "cancelled") {
      // Check if new slot is available
      const existingAppointment = await db.collection("appointments").findOne({
        doctorId: appointment.doctorId,
        date: data.date,
        time: data.time,
        status: { $ne: "cancelled" },
        _id: { $ne: new ObjectId(data.id) },
      })

      if (existingAppointment) {
        return NextResponse.json({ error: "New appointment slot is already booked" }, { status: 409 })
      }

      updateData.date = data.date
      updateData.time = data.time
    }

    updateData.updatedAt = new Date()

    const result = await db.collection("appointments").updateOne({ _id: new ObjectId(data.id) }, { $set: updateData })

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "No changes made to appointment" }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Appointment updated successfully" })
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

