import type { NextApiRequest, NextApiResponse } from "next"
import dbConnect from "../db/connect"
import Appointment from "../models/Appointment"
import Doctor from "../models/Doctor"
import { authMiddleware } from "../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  const { user } = req as any

  await dbConnect()

  switch (method) {
    case "POST":
      try {
        const { doctorId, hospitalId, date, startTime, endTime, type, reason } = req.body

        // Verify doctor exists
        const doctor = await Doctor.findById(doctorId)
        if (!doctor) {
          return res.status(404).json({ success: false, message: "Doctor not found" })
        }

        // Create appointment
        const appointment = new Appointment({
          patientId: user._id,
          doctorId,
          hospitalId,
          date,
          startTime,
          endTime,
          status: "scheduled",
          type,
          reason,
          paymentStatus: "pending",
        })

        await appointment.save()

        res.status(201).json({ success: true, data: appointment })
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error })
      }
      break
    case "GET":
      try {
        const { id, status } = req.query

        if (id) {
          // Get specific appointment
          const appointment = await Appointment.findById(id)
            .populate("doctorId", "name specialization")
            .populate("hospitalId", "name address")

          if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" })
          }

          // Check authorization
          if (
            appointment.patientId.toString() !== user._id.toString() &&
            appointment.hospitalId.toString() !== user._id.toString() &&
            user.role !== "hospital"
          ) {
            return res.status(403).json({ success: false, message: "Unauthorized" })
          }

          return res.status(200).json({ success: true, data: appointment })
        }

        // Get all appointments for user or hospital
        const query: any = {}

        if (user.role === "hospital") {
          query.hospitalId = user._id
        } else {
          query.patientId = user._id
        }

        if (status) {
          query.status = status
        }

        const appointments = await Appointment.find(query)
          .sort({ date: 1, startTime: 1 })
          .populate("doctorId", "name specialization")
          .populate("hospitalId", "name")

        res.status(200).json({ success: true, data: appointments })
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error })
      }
      break
    case "PUT":
      try {
        const { id } = req.query
        const { status, notes, followUp } = req.body

        // Find appointment
        const appointment = await Appointment.findById(id)

        if (!appointment) {
          return res.status(404).json({ success: false, message: "Appointment not found" })
        }

        // Check authorization
        if (
          appointment.patientId.toString() !== user._id.toString() &&
          appointment.hospitalId.toString() !== user._id.toString() &&
          user.role !== "hospital"
        ) {
          return res.status(403).json({ success: false, message: "Unauthorized" })
        }

        // Update appointment
        if (status) {
          appointment.status = status
        }

        if (notes) {
          appointment.notes = notes
        }

        if (followUp !== undefined) {
          appointment.followUp = followUp
        }

        await appointment.save()

        res.status(200).json({ success: true, data: appointment })
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

