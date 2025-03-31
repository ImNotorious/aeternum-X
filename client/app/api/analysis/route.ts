import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.type || !data.results) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("aeternum")

    // Create analysis record
    const analysis = {
      patientId: session.user.id,
      type: data.type,
      results: data.results,
      confidence: data.confidence,
      imageUrl: data.imageUrl,
      recommendations: data.recommendations,
      createdAt: new Date(),
    }

    const result = await db.collection("analyses").insertOne(analysis)

    // Also create a medical record for this analysis
    const medicalRecord = {
      patientId: session.user.id,
      type: "AI Analysis",
      date: new Date().toISOString().split("T")[0],
      description: `${data.type} Analysis: ${data.results.condition || data.results.risk || "Results available"}`,
      encrypted: true,
      createdBy: session.user.id,
      analysisId: result.insertedId,
      createdAt: new Date(),
    }

    await db.collection("medicalRecords").insertOne(medicalRecord)

    return NextResponse.json(
      {
        id: result.insertedId,
        ...analysis,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error saving analysis:", error)
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
    const patientId = searchParams.get("patientId") || session.user.id
    const type = searchParams.get("type")

    // Only allow doctors, admins, and hospital staff to view other patients' analyses
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

    const analyses = await db.collection("analyses").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(analyses)
  } catch (error) {
    console.error("Error fetching analyses:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

