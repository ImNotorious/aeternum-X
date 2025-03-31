import mongoose, { Schema, type Document } from "mongoose"

export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId
  doctorId: mongoose.Types.ObjectId
  hospitalId: mongoose.Types.ObjectId
  date: Date
  startTime: string
  endTime: string
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  type: "in-person" | "video" | "phone"
  reason: string
  notes?: string
  followUp?: boolean
  paymentStatus: "pending" | "completed" | "refunded"
  paymentId?: string
  paymentAmount?: number
  paymentMethod?: "card" | "crypto" | "insurance"
}

const AppointmentSchema: Schema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },
    type: {
      type: String,
      enum: ["in-person", "video", "phone"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    followUp: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "refunded"],
      default: "pending",
    },
    paymentId: {
      type: String,
    },
    paymentAmount: {
      type: Number,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "crypto", "insurance"],
    },
  },
  { timestamps: true },
)

export default mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment", AppointmentSchema)

