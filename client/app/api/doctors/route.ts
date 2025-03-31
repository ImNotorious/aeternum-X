import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const specialty = searchParams.get("specialty")

    const client = await clientPromise
    const db = client.db("aeternum")

    if (id) {
      // Get specific doctor
      const doctor = await db.collection("doctors").findOne({
        _id: new ObjectId(id),
      })

      if (!doctor) {
        return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
      }

      return NextResponse.json(doctor)
    }

    // Get all doctors with optional specialty filter
    let query = {}
    if (specialty && specialty !== "all") {
      query = { specialty: { $regex: specialty, $options: "i" } }
    }

    const doctors = await db.collection("doctors").find(query).toArray()

    return NextResponse.json(doctors)
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.specialty || !data.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("aeternum")

    // Check if doctor with email already exists
    const existingDoctor = await db.collection("doctors").findOne({ email: data.email })
    if (existingDoctor) {
      return NextResponse.json({ error: "Doctor with this email already exists" }, { status: 409 })
    }

    // Create new doctor
    const doctor = {
      name: data.name,
      specialty: data.specialty,
      email: data.email,
      phone: data.phone,
      location: data.location,
      consultationFee: data.consultationFee || "0.05 ETH",
      consultationFeeUsd: data.consultationFeeUsd || "$100.00",
      availableDays: data.availableDays || [1, 2, 3, 4, 5],
      timeSlots: data.timeSlots || ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
      avatar: data.avatar || "/placeholder.svg?height=100&width=100",
      rating: data.rating || 4.8,
      reviews: data.reviews || 0,
      experience: data.experience || "5 years",
      createdAt: new Date(),
    }

    const result = await db.collection("doctors").insertOne(doctor)

    return NextResponse.json(
      {
        id: result.insertedId,
        ...doctor,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating doctor:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

