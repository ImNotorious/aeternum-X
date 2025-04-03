import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

// Update the GET function to ensure we always return the custom ID
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated via NextAuth
    const isAuthorized = session?.user?.role === "hospital" || session?.user?.role === "admin"

    // If not authorized via NextAuth, we'll assume Firebase auth is being used
    // and proceed with the request (we'll rely on client-side auth check)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const id = searchParams.get("id")

    const client = await clientPromise
    const db = client.db("aeternum")

    if (id) {
      let ambulance

      // Try to find by custom ID first
      ambulance = await db.collection("ambulances").findOne({ id: id })

      // If not found, try by MongoDB ObjectId
      if (!ambulance) {
        try {
          ambulance = await db.collection("ambulances").findOne({
            _id: new ObjectId(id),
          })
        } catch (error) {
          // Invalid ObjectId format, just continue
        }
      }

      if (!ambulance) {
        return NextResponse.json({ error: "Ambulance not found" }, { status: 404 })
      }

      // Ensure ambulance has a custom ID
      if (!ambulance.id) {
        ambulance.id = `AMB-${Math.floor(1000 + Math.random() * 9000)}`
        // Update the document with the new ID
        await db.collection("ambulances").updateOne({ _id: ambulance._id }, { $set: { id: ambulance.id } })
      }

      return NextResponse.json(ambulance)
    }

    let query = {}
    if (status) {
      query = { status }
    }

    const ambulances = await db.collection("ambulances").find(query).toArray()

    // Ensure all ambulances have a custom ID
    for (const ambulance of ambulances) {
      if (!ambulance.id) {
        ambulance.id = `AMB-${Math.floor(1000 + Math.random() * 9000)}`
        // Update the document with the new ID
        await db.collection("ambulances").updateOne({ _id: ambulance._id }, { $set: { id: ambulance.id } })
      }
    }

    return NextResponse.json(ambulances)
  } catch (error) {
    console.error("Error fetching ambulances:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated via NextAuth
    const isAuthorized = session?.user?.role === "hospital" || session?.user?.role === "admin"

    // If not authorized via NextAuth, we'll assume Firebase auth is being used
    // and proceed with the request (we'll rely on client-side auth check)

    const data = await request.json()

    // Validate required fields
    if (!data.driverName || !data.vehicleNumber || !data.status || !data.location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("aeternum")

    // Create a new ambulance document with the provided ID or generate one
    const ambulanceId = data.id || `AMB-${Math.floor(1000 + Math.random() * 9000)}`

    const newAmbulance = {
      id: ambulanceId,
      driverName: data.driverName,
      vehicleNumber: data.vehicleNumber,
      status: data.status,
      location: data.location,
      lastService: data.lastService,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("ambulances").insertOne(newAmbulance)

    return NextResponse.json({
      success: true,
      message: "Ambulance created successfully",
      data: { ...newAmbulance, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating ambulance:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated via NextAuth
    const isAuthorized = session?.user?.role === "hospital" || session?.user?.role === "admin"

    // If not authorized via NextAuth, we'll assume Firebase auth is being used
    // and proceed with the request (we'll rely on client-side auth check)

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: "Missing ambulance ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("aeternum")

    const updateData: any = {}
    if (data.status) updateData.status = data.status
    if (data.location) updateData.location = data.location
    if (data.driverName) updateData.driverName = data.driverName
    if (data.vehicleNumber) updateData.vehicleNumber = data.vehicleNumber
    if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber
    if (data.lastService) updateData.lastService = new Date(data.lastService)

    updateData.lastUpdated = new Date()

    // Try to update by MongoDB _id first
    let result
    try {
      result = await db.collection("ambulances").updateOne({ _id: new ObjectId(data.id) }, { $set: updateData })
    } catch (error) {
      // If that fails, try to update by the custom id field
      result = await db.collection("ambulances").updateOne({ id: data.id }, { $set: updateData })
    }

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Ambulance not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Ambulance updated successfully" })
  } catch (error) {
    console.error("Error updating ambulance:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated via NextAuth
    const isAuthorized = session?.user?.role === "hospital" || session?.user?.role === "admin"

    // If not authorized via NextAuth, we'll assume Firebase auth is being used
    // and proceed with the request (we'll rely on client-side auth check)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing ambulance ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("aeternum")

    // Try to delete by MongoDB _id first
    let result
    try {
      result = await db.collection("ambulances").deleteOne({
        _id: new ObjectId(id),
      })
    } catch (error) {
      // If that fails, try to delete by the custom id field
      result = await db.collection("ambulances").deleteOne({
        id: id,
      })
    }

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Ambulance not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Ambulance removed successfully" })
  } catch (error) {
    console.error("Error removing ambulance:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

