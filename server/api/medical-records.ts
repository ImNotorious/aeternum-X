import type { NextApiRequest, NextApiResponse } from "next"
import dbConnect from "../db/connect"
import MedicalRecord from "../models/MedicalRecord"
import { authMiddleware } from "../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  const { user } = req as any

  await dbConnect()

  switch (method) {
    case "POST":
      try {
        // Only hospitals can create medical records
        if (user.role !== "hospital") {
          return res.status(403).json({ success: false, message: "Unauthorized" })
        }

        const {
          patientId,
          doctorId,
          recordType,
          title,
          description,
          date,
          attachments,
          diagnosis,
          prescription,
          labResult,
          imaging,
          isEncrypted,
          blockchainReference,
          accessControl,
        } = req.body

        // Create medical record
        const medicalRecord = new MedicalRecord({
          patientId,
          doctorId,
          hospitalId: user._id,
          recordType,
          title,
          description,
          date: date || new Date(),
          attachments,
          diagnosis,
          prescription,
          labResult,
          imaging,
          isEncrypted: isEncrypted !== undefined ? isEncrypted : true,
          blockchainReference,
          accessControl: accessControl || {
            publiclyAccessible: false,
            authorizedUsers: [patientId],
            authorizedHospitals: [user._id],
          },
        })

        await medicalRecord.save()

        res.status(201).json({ success: true, data: medicalRecord })
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error })
      }
      break
    case "GET":
      try {
        const { id, patientId } = req.query

        if (id) {
          // Get specific medical record
          const medicalRecord = await MedicalRecord.findById(id)
            .populate("patientId", "name")
            .populate("doctorId", "name specialization")
            .populate("hospitalId", "name")

          if (!medicalRecord) {
            return res.status(404).json({ success: false, message: "Medical record not found" })
          }

          // Check authorization
          const isAuthorized =
            medicalRecord.patientId.toString() === user._id.toString() ||
            medicalRecord.hospitalId.toString() === user._id.toString() ||
            medicalRecord.accessControl.publiclyAccessible ||
            (medicalRecord.accessControl.authorizedUsers &&
              medicalRecord.accessControl.authorizedUsers.includes(user._id)) ||
            (medicalRecord.accessControl.authorizedHospitals &&
              medicalRecord.accessControl.authorizedHospitals.includes(user._id))

          if (!isAuthorized) {
            return res.status(403).json({ success: false, message: "Unauthorized" })
          }

          return res.status(200).json({ success: true, data: medicalRecord })
        }

        // Get all medical records for user or patient
        const query: any = {}

        if (user.role === "hospital") {
          if (patientId) {
            query.patientId = patientId
          } else {
            query.hospitalId = user._id
          }
        } else {
          query.patientId = user._id
        }

        const medicalRecords = await MedicalRecord.find(query)
          .sort({ date: -1 })
          .populate("doctorId", "name specialization")
          .populate("hospitalId", "name")

        res.status(200).json({ success: true, data: medicalRecords })
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error })
      }
      break
    case "PUT":
      try {
        // Only hospitals can update medical records
        if (user.role !== "hospital") {
          return res.status(403).json({ success: false, message: "Unauthorized" })
        }

        const { id } = req.query
        const { title, description, attachments, diagnosis, prescription, labResult, imaging, accessControl } = req.body

        // Find medical record
        const medicalRecord = await MedicalRecord.findById(id)

        if (!medicalRecord) {
          return res.status(404).json({ success: false, message: "Medical record not found" })
        }

        // Check authorization
        if (medicalRecord.hospitalId.toString() !== user._id.toString()) {
          return res.status(403).json({ success: false, message: "Unauthorized" })
        }

        // Update medical record
        if (title) {
          medicalRecord.title = title
        }

        if (description) {
          medicalRecord.description = description
        }

        if (attachments) {
          medicalRecord.attachments = attachments
        }

        if (diagnosis) {
          medicalRecord.diagnosis = diagnosis
        }

        if (prescription) {
          medicalRecord.prescription = prescription
        }

        if (labResult) {
          medicalRecord.labResult = labResult
        }

        if (imaging) {
          medicalRecord.imaging = imaging
        }

        if (accessControl) {
          medicalRecord.accessControl = accessControl
        }

        await medicalRecord.save()

        res.status(200).json({ success: true, data: medicalRecord })
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

