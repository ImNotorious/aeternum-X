import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Define a type for the ambulance object
interface Ambulance {
  _id: string;
  driverName: string;
  vehicleNumber: string;
  phoneNumber: string;
}

// Type guard to check if availableAmbulance.value is not null
function isAmbulance(value: any): value is { value: Ambulance } {
  return value !== null && typeof value === "object" && "value" in value && value.value !== null;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Allow emergency requests without authentication for public safety
    // but track if user is authenticated

    const data = await request.json();

    // Validate required fields
    if (!data.emergencyType || !data.location || !data.patientName || !data.contactNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("aeternum");

    // Find available ambulance
    const availableAmbulance = await db
      .collection("ambulances")
      .findOneAndUpdate(
        { status: "available" },
        { $set: { status: "on_call", lastUpdated: new Date() } },
        { returnDocument: "after" }
      );

    // Use the type guard to check if availableAmbulance.value exists
    if (!isAmbulance(availableAmbulance)) {
      // Create emergency request but mark as pending
      const emergencyCall = {
        ...data,
        status: "pending",
        userId: session?.user?.id || null,
        ambulanceId: null,
        createdAt: new Date(),
      };

      await db.collection("emergencyCalls").insertOne(emergencyCall);

      return NextResponse.json(
        {
          message:
            "Emergency request received but all ambulances are currently busy. We will dispatch one as soon as possible.",
          status: "pending",
        },
        { status: 202 }
      );
    }

    // Create emergency request with assigned ambulance
    const emergencyCall = {
      ...data,
      status: "dispatched",
      userId: session?.user?.id || null,
      ambulanceId: availableAmbulance.value._id,
      createdAt: new Date(),
    };

    const result = await db.collection("emergencyCalls").insertOne(emergencyCall);

    return NextResponse.json(
      {
        id: result.insertedId,
        ambulance: {
          id: availableAmbulance.value._id,
          driverName: availableAmbulance.value.driverName,
          vehicleNumber: availableAmbulance.value.vehicleNumber,
          phoneNumber: availableAmbulance.value.phoneNumber,
        },
        status: "dispatched",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing emergency request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const client = await clientPromise;
    const db = client.db("aeternum");

    let query = {}

    if (status) {
      query = { status }
    }

    // If user is not admin or hospital staff, only show their own emergency calls
    if (session.user.role !== "admin" && session.user.role !== "hospital") {
      query = { ...query, userId: session.user.id }
    }

    const emergencyCalls = await db.collection("emergencyCalls").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(emergencyCalls)
  } catch (error) {
    console.error("Error fetching emergency calls:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

