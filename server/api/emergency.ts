import type { NextApiRequest, NextApiResponse } from "next"
import dbConnect from "../db/connect"
import EmergencyCall from "../models/EmergencyCall"
import Ambulance from "../models/Ambulance"
import { authMiddleware } from "../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  const { user } = req as any

  await dbConnect()

  // Only hospitals can access emergency services
  if (user.role !== "hospital") {
    return res.status(403).json({ success: false, message: "Unauthorized" })
  }

  switch (method) {
    case "POST":
      try {
        const { patientId, callerName, callerPhone, location, emergencyType, description, priority } = req.body

        // Create emergency call
        const emergencyCall = new EmergencyCall({
          patientId,
          hospitalId: user._id,
          callerName,
          callerPhone,
          location,
          emergencyType,
          description,
          priority: priority || "medium",
          timeReceived: new Date(),
          status: "active",
        })

        await emergencyCall.save()

        res.status(201).json({ success: true, data: emergencyCall })
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error })
      }
      break
    case "GET":
      try {
        const { id, status } = req.query

        if (id) {
          // Get specific emergency call
          const emergencyCall = await EmergencyCall.findById(id)
            .populate("assignedAmbulance")
            .populate("assignedPersonnel", "name")

          if (!emergencyCall) {
            return res.status(404).json({ success: false, message: "Emergency call not found" })
          }

          // Check authorization
          if (emergencyCall.hospitalId.toString() !== user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" })
          }

          return res.status(200).json({ success: true, data: emergencyCall })
        }

        // Get all emergency calls for hospital
        const query: any = { hospitalId: user._id }

        if (status) {
          query.status = status
        }

        const emergencyCalls = await EmergencyCall.find(query)
          .sort({ timeReceived: -1 })
          .populate("assignedAmbulance")
          .populate("assignedPersonnel", "name")

        res.status(200).json({ success: true, data: emergencyCalls })
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error })
      }
      break
    case "PUT":
      try {
        const { id } = req.query
        const { status, assignedAmbulance, trafficAlertSent, notes } = req.body

        // Find emergency call
        const emergencyCall = await EmergencyCall.findById(id)

        if (!emergencyCall) {
          return res.status(404).json({ success: false, message: "Emergency call not found" })
        }

        // Check authorization
        if (emergencyCall.hospitalId.toString() !== user._id.toString()) {
          return res.status(403).json({ success: false, message: "Unauthorized" })
        }

        // Update emergency call
        if (status) {
          emergencyCall.status = status

          // Update timestamps based on status
          if (status === "dispatched" && !emergencyCall.timeDispatched) {
            emergencyCall.timeDispatched = new Date()
          } else if (status === "arrived" && !emergencyCall.timeArrived) {
            emergencyCall.timeArrived = new Date()
          } else if (status === "completed" && !emergencyCall.timeCompleted) {
            emergencyCall.timeCompleted = new Date()
          }
        }

        if (assignedAmbulance) {
          // Verify ambulance exists and belongs to hospital
          const ambulance = await Ambulance.findById(assignedAmbulance)

          if (!ambulance) {
            return res.status(404).json({ success: false, message: "Ambulance not found" })
          }

          if (ambulance.hospitalId.toString() !== user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" })
          }

          // Update ambulance status
          ambulance.status = "dispatched"
          ambulance.currentEmergency = emergencyCall._id
          await ambulance.save()

          // Update emergency call
          emergencyCall.assignedAmbulance = ambulance._id
        }

        if (trafficAlertSent !== undefined) {
          emergencyCall.trafficAlertSent = trafficAlertSent
        }

        if (notes) {
          emergencyCall.notes = notes
        }

        await emergencyCall.save()

        res.status(200).json({ success: true, data: emergencyCall })
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

