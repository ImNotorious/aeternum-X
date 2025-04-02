import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("Attempting to connect to MongoDB...")

    // Connect to the MongoDB client
    const client = await clientPromise
    console.log("Client connection established")

    // Get the database
    const db = client.db("aeternum")
    console.log("Database selected")

    // Perform a simple query to test the connection
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    console.log("Successfully retrieved collections:", collectionNames)

    return NextResponse.json({
      status: "Connected successfully to MongoDB!",
      collections: collectionNames,
    })
  } catch (error) {
    console.error("MongoDB connection error:", error)

    // More detailed error information
    const errorDetails = {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    }

    return NextResponse.json(
      {
        error: "Failed to connect to MongoDB",
        details: errorDetails,
      },
      { status: 500 },
    )
  }
}

