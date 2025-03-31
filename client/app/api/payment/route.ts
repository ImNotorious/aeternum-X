import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.appointmentId || !data.amount || !data.paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("aeternum")

    // Check if appointment exists
    const appointment = await db.collection("appointments").findOne({
      _id: new ObjectId(data.appointmentId),
    })

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Verify that the user is the appointment owner
    if (appointment.patientId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create payment record
    const payment = {
      appointmentId: data.appointmentId,
      patientId: session.user.id,
      amount: data.amount,
      amountUsd: data.amountUsd,
      paymentMethod: data.paymentMethod,
      status: "completed",
      transactionId: data.transactionId || data.transactionHash || `TXN-${Date.now()}`,
      createdAt: new Date(),
    }

    const result = await db.collection("payments").insertOne(payment)

    // Update appointment payment status
    await db
      .collection("appointments")
      .updateOne(
        { _id: new ObjectId(data.appointmentId) },
        { $set: { paymentStatus: "paid", paymentId: result.insertedId.toString() } },
      )

    return NextResponse.json(
      {
        id: result.insertedId,
        ...payment,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get("appointmentId")
    const userId = searchParams.get("userId") || session.user.id

    // Only allow admins to view other users' payments
    if (userId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("aeternum")

    const query: any = { patientId: userId }

    if (appointmentId) {
      query.appointmentId = appointmentId
    }

    const payments = await db.collection("payments").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

