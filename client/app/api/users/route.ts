import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { auth } from "@/lib/firebase-admin"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    const client = await clientPromise
    const db = client.db("aeternum")

    let query = {}
    if (role) {
      query = { ...query, role }
    }

    const users = await db.collection("users").find(query).toArray()

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Allow registration without authentication
    const data = await request.json()

    // Validate required fields
    if (!data.email || !data.password || !data.name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
    })

    // Set custom claims for role
    await auth.setCustomUserClaims(userRecord.uid, {
      role: data.role || "patient",
    })

    // Store additional user data in MongoDB
    const client = await clientPromise
    const db = client.db("aeternum")

    const userData = {
      uid: userRecord.uid,
      email: data.email,
      name: data.name,
      role: data.role || "patient",
      createdAt: new Date(),
      ...data.profile,
    }

    await db.collection("users").insertOne(userData)

    return NextResponse.json(
      {
        id: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName,
        role: data.role || "patient",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error creating user:", error)

    if (error.code === "auth/email-already-exists") {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

