import type { NextApiRequest, NextApiResponse } from "next"
import dbConnect from "../db/connect"
import Payment from "../models/Payment"
import Appointment from "../models/Appointment"
import { authMiddleware } from "../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  const { user } = req as any

  await dbConnect()

  switch (method) {
    case "POST":
      try {
        const { appointmentId, amount, currency, paymentMethod, paymentDetails, description } = req.body

        // Verify appointment exists and belongs to the user
        const appointment = await Appointment.findById(appointmentId)
        if (!appointment) {
          return res.status(404).json({ success: false, message: "Appointment not found" })
        }

        if (appointment.patientId.toString() !== user._id.toString() && user.role !== "hospital") {
          return res.status(403).json({ success: false, message: "Unauthorized" })
        }

        // Generate invoice number
        const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`

        // Create payment
        const payment = new Payment({
          appointmentId,
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          hospitalId: appointment.hospitalId,
          amount,
          currency: currency || "USD",
          status: "pending",
          paymentMethod,
          paymentDetails,
          description,
          invoiceNumber,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
        })

        await payment.save()

        // Update appointment payment status
        appointment.paymentStatus = "pending"
        appointment.paymentId = payment._id
        appointment.paymentAmount = amount
        appointment.paymentMethod = paymentMethod
        await appointment.save()

        res.status(201).json({ success: true, data: payment })
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error })
      }
      break
    case "GET":
      try {
        const { id } = req.query

        if (id) {
          // Get specific payment
          const payment = await Payment.findById(id)

          if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" })
          }

          // Check authorization
          if (
            payment.patientId.toString() !== user._id.toString() &&
            payment.hospitalId.toString() !== user._id.toString() &&
            user.role !== "hospital"
          ) {
            return res.status(403).json({ success: false, message: "Unauthorized" })
          }

          return res.status(200).json({ success: true, data: payment })
        }

        // Get all payments for user or hospital
        let query = {}

        if (user.role === "hospital") {
          query = { hospitalId: user._id }
        } else {
          query = { patientId: user._id }
        }

        const payments = await Payment.find(query)
          .sort({ createdAt: -1 })
          .populate("appointmentId", "date startTime endTime")
          .populate("doctorId", "name specialization")
          .populate("hospitalId", "name")

        res.status(200).json({ success: true, data: payments })
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

