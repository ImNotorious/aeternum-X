import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId") || session.user.id
    const type = searchParams.get("type")

    // Only allow doctors, admins, and hospital staff to view other patients' records
    if (
      patientId !== session.user.id &&
      session.user.role !== "doctor" &&
      session.user.role !== "admin" &&
      session.user.role !== "hospital"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("aeternum")

    const query: any = { patientId }

    if (type) {
      query.type = type
    }

    const records = await db.collection("medicalRecords").find(query).sort({ date: -1 }).toArray()

    return NextResponse.json(records)
  } catch (error) {
    console.error("Error fetching medical records:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.type || !data.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("aeternum")

    // Determine patient ID - if doctor is creating record for patient
    const patientId = data.patientId || session.user.id

    // If creating record for another patient, verify permissions
    if (
      patientId !== session.user.id &&
      session.user.role !== "doctor" &&
      session.user.role !== "admin" &&
      session.user.role !== "hospital"
    ) {
      return NextResponse.json({ error: "Unauthorized to create records for this patient" }, { status: 401 })
    }

    // Create medical record
    const record = {
      patientId,
      type: data.type,
      date: data.date || new Date().toISOString().split("T")[0],
      doctor: data.doctorId || (session.user.role === "doctor" ? session.user.id : null),
      doctorName: data.doctorName,
      description: data.description,
      fileUrl: data.fileUrl,
      encrypted: data.encrypted || true,
      createdBy: session.user.id,
      createdAt: new Date(),
    }

    const result = await db.collection("medicalRecords").insertOne(record)

    return NextResponse.json(
      {
        id: result.insertedId,
        ...record,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating medical record:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing record ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("aeternum")

    // Get the record
    const record = await db.collection("medicalRecords").findOne({
      _id: new ObjectId(id),
    })

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    // Check authorization - only the patient, the doctor who created it, or admin can delete
    if (record.patientId !== session.user.id && record.createdBy !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized to delete this record" }, { status: 401 })
    }

    // Delete the record
    await db.collection("medicalRecords").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true, message: "Record deleted successfully" })
  } catch (error) {
    console.error("Error deleting medical record:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

