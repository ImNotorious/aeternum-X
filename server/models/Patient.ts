import mongoose, { Schema, type Document } from "mongoose"

export interface IPatient extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  dateOfBirth: Date
  gender: string
  bloodType?: string
  allergies?: string[]
  medicalConditions?: string[]
  medications?: string[]
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  insuranceInfo?: {
    provider: string
    policyNumber: string
    groupNumber?: string
  }
}

const PatientSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    allergies: [
      {
        type: String,
        trim: true,
      },
    ],
    medicalConditions: [
      {
        type: String,
        trim: true,
      },
    ],
    medications: [
      {
        type: String,
        trim: true,
      },
    ],
    emergencyContact: {
      name: {
        type: String,
        trim: true,
      },
      relationship: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      zipCode: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
    },
    insuranceInfo: {
      provider: {
        type: String,
        trim: true,
      },
      policyNumber: {
        type: String,
        trim: true,
      },
      groupNumber: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true },
)

export default mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema)

