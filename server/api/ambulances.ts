import type { NextApiRequest, NextApiResponse } from "next"
import dbConnect from "../db/connect"
import Ambulance from "../models/Ambulance"
import { authMiddleware } from "../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  const { user } = req as any

  await dbConnect()

  // Only hospitals can access ambulance management
  if (user.role !== "hospital") {
    return res.status(403).json({ success: false, message: "Unauthorized" })
  }

  switch (method) {
    case "POST":
      try {
        const { ambulanceId, type, capacity, equipment, vehicleDetails } = req.body

        // Check if ambulance ID already exists
        const existingAmbulance = await Ambulance.findOne({ ambulanceId })
        if (existingAmbulance) {
          return res.status(400).json({ success: false, message: "Ambulance ID already exists" })
        }

        // Create ambulance
        const ambulance = new Ambulance({
          hospitalId: user._id,
          ambulanceId,
          type,
          status: "available",
          capacity,
          equipment,
          vehicleDetails,
          maintenanceSchedule: {
            lastMaintenance: new Date(),
            nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
            maintenanceType: "Regular check-up",
          },
        })

        await ambulance.save()

        res.status(201).json({ success: true, data: ambulance })
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error })
      }
      break
    case "GET":
      try {
        const { id, status } = req.query

        if (id) {
          // Get specific ambulance
          const ambulance = await Ambulance.findById(id).populate("crew", "name").populate("currentEmergency")

          if (!ambulance) {
            return res.status(404).json({ success: false, message: "Ambulance not found" })
          }

          // Check authorization
          if (ambulance.hospitalId.toString() !== user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" })
          }

          return res.status(200).json({ success: true, data: ambulance })
        }

        // Get all ambulances for hospital
        const query: any = { hospitalId: user._id }

        if (status) {
          query.status = status
        }

        const ambulances = await Ambulance.find(query).sort({ ambulanceId: 1 }).populate("currentEmergency")

        res.status(200).json({ success: true, data: ambulances })
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error })
      }
      break
    case "PUT":
      try {
        const { id } = req.query
        const { status, location, crew, maintenanceSchedule } = req.body

        // Find ambulance
        const ambulance = await Ambulance.findById(id)

        if (!ambulance) {
          return res.status(404).json({ success: false, message: "Ambulance not found" })
        }

        // Check authorization
        if (ambulance.hospitalId.toString() !== user._id.toString()) {
          return res.status(403).json({ success: false, message: "Unauthorized" })
        }

        // Update ambulance
        if (status) {
          ambulance.status = status

          // If status is available, clear current emergency
          if (status === "available") {
            ambulance.currentEmergency = undefined
          }
        }

        if (location) {
          ambulance.location = {
            coordinates: location.coordinates,
            lastUpdated: new Date(),
          }
        }

        if (crew) {
          ambulance.crew = crew
        }

        if (maintenanceSchedule) {
          ambulance.maintenanceSchedule = {
            ...ambulance.maintenanceSchedule,
            ...maintenanceSchedule,
          }
        }

        await ambulance.save()

        res.status(200).json({ success: true, data: ambulance })
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error })
      }
      break
    default:
      res.status(405).json({ success: false, message: "Method not allowed" })
      break
  }
}

export default authMiddleware(handler)

