import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// This is a development-only endpoint to seed the database with initial data
export async function POST(request: Request) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "This endpoint is only available in development" }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db("aeternum")

    // Seed doctors
    const doctors = [
      {
        name: "Dr. Sarah Johnson",
        specialty: "Cardiologist",
        email: "sarah.johnson@aeternum.com",
        phone: "+91 98765 43210",
        location: "Main Hospital, Floor 3",
        consultationFee: "0.05 ETH",
        consultationFeeUsd: "$100.00",
        availableDays: [1, 2, 3, 4, 5],
        timeSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
        avatar: "/placeholder.svg?height=100&width=100",
        rating: 4.9,
        reviews: 124,
        experience: "15 years",
      },
      {
        name: "Dr. Michael Chen",
        specialty: "Neurologist",
        email: "michael.chen@aeternum.com",
        phone: "+91 87654 32109",
        location: "North Wing, Floor 2",
        consultationFee: "0.06 ETH",
        consultationFeeUsd: "$120.00",
        availableDays: [1, 3, 5],
        timeSlots: ["09:30", "10:30", "11:30", "14:30", "15:30"],
        avatar: "/placeholder.svg?height=100&width=100",
        rating: 4.8,
        reviews: 98,
        experience: "12 years",
      },
      {
        name: "Dr. Emily Rodriguez",
        specialty: "Dermatologist",
        email: "emily.rodriguez@aeternum.com",
        phone: "+91 76543 21098",
        location: "Outpatient Clinic",
        consultationFee: "0.04 ETH",
        consultationFeeUsd: "$80.00",
        availableDays: [2, 4],
        timeSlots: ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
        avatar: "/placeholder.svg?height=100&width=100",
        rating: 4.7,
        reviews: 156,
        experience: "10 years",
      },
      {
        name: "Dr. James Wilson",
        specialty: "Orthopedic Surgeon",
        email: "james.wilson@aeternum.com",
        phone: "+91 65432 10987",
        location: "Surgery Center, Floor 4",
        consultationFee: "0.07 ETH",
        consultationFeeUsd: "$140.00",
        availableDays: [1, 2, 3, 4, 5],
        timeSlots: ["08:30", "09:30", "10:30", "13:30", "14:30", "15:30"],
        avatar: "/placeholder.svg?height=100&width=100",
        rating: 4.9,
        reviews: 210,
        experience: "18 years",
      },
    ]

    // Seed ambulances
    const ambulances = [
      {
        driverName: "Rajesh Kumar",
        vehicleNumber: "DL 01 AB 1234",
        status: "available",
        location: "North Delhi",
        phoneNumber: "+91 98765 43210",
        lastService: new Date("2023-04-28"),
      },
      {
        driverName: "Suresh Yadav",
        vehicleNumber: "DL 01 CD 5678",
        status: "available",
        location: "South Delhi",
        phoneNumber: "+91 87654 32109",
        lastService: new Date("2023-05-05"),
      },
      {
        driverName: "Mahesh Singh",
        vehicleNumber: "DL 01 EF 9012",
        status: "available",
        location: "West Delhi",
        phoneNumber: "+91 76543 21098",
        lastService: new Date("2023-05-12"),
      },
      {
        driverName: "Dinesh Gupta",
        vehicleNumber: "DL 01 GH 3456",
        status: "available",
        location: "East Delhi",
        phoneNumber: "+91 65432 10987",
        lastService: new Date("2023-04-15"),
      },
      {
        driverName: "Ramesh Verma",
        vehicleNumber: "DL 01 IJ 7890",
        status: "available",
        location: "Central Delhi",
        phoneNumber: "+91 54321 09876",
        lastService: new Date("2023-05-01"),
      },
    ]

    // Insert data
    await db.collection("doctors").insertMany(doctors)
    await db.collection("ambulances").insertMany(ambulances)

    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

