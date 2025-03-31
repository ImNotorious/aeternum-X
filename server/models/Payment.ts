import mongoose, { Schema, type Document } from "mongoose"

export interface IPayment extends Document {
  appointmentId?: mongoose.Types.ObjectId
  patientId: mongoose.Types.ObjectId
  doctorId?: mongoose.Types.ObjectId
  hospitalId: mongoose.Types.ObjectId
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  paymentMethod: "card" | "crypto" | "insurance" | "bank-transfer"
  paymentDetails?: {
    cardLast4?: string
    cardBrand?: string
    cryptoTransactionHash?: string
    insuranceProvider?: string
    insurancePolicyNumber?: string
    bankReference?: string
  }
  description: string
  invoiceNumber: string
  paymentDate?: Date
  dueDate?: Date
  refundAmount?: number
  refundDate?: Date
  refundReason?: string
  metadata?: Record<string, any>
}

const PaymentSchema: Schema = new Schema(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "crypto", "insurance", "bank-transfer"],
      required: true,
    },
    paymentDetails: {
      cardLast4: {
        type: String,
        trim: true,
      },
      cardBrand: {
        type: String,
        trim: true,
      },
      cryptoTransactionHash: {
        type: String,
        trim: true,
      },
      insuranceProvider: {
        type: String,
        trim: true,
      },
      insurancePolicyNumber: {
        type: String,
        trim: true,
      },
      bankReference: {
        type: String,
        trim: true,
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    paymentDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    refundAmount: {
      type: Number,
      min: 0,
    },
    refundDate: {
      type: Date,
    },
    refundReason: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema)

