import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated and has admin privileges
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    const client = await clientPromise;
    const db = client.db("aeternum");

    // Build query based on role
    let query = {};
    if (role) {
      query = { ...query, role };
    }

    // Fetch users from MongoDB
    const users = await db.collection("users").find(query).toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.email || !data.password || !data.name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("aeternum");

    // Check if the email already exists
    const existingUser = await db.collection("users").findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    // Hash password (use bcrypt for security)
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create new user in MongoDB
    const userData = {
      email: data.email,
      password: hashedPassword, // Store hashed password
      name: data.name,
      role: data.role || "patient",
      createdAt: new Date(),
      ...data.profile,
    };

    const result = await db.collection("users").insertOne(userData);

    return NextResponse.json(
      {
        id: result.insertedId,
        email: userData.email,
        name: userData.name,
        role: userData.role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
