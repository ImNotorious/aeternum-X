import mongoose, { Schema, type Document } from "mongoose"

export interface IDoctor extends Document {
  userId?: mongoose.Types.ObjectId
  hospitalId: mongoose.Types.ObjectId
  name: string
  specialization: string
  qualifications: string[]
  licenseNumber: string
  experience: number // in years
  availability: {
    monday?: { start: string; end: string }[]
    tuesday?: { start: string; end: string }[]
    wednesday?: { start: string; end: string }[]
    thursday?: { start: string; end: string }[]
    friday?: { start: string; end: string }[]
    saturday?: { start: string; end: string }[]
    sunday?: { start: string; end: string }[]
  }
  contactInfo: {
    email: string
    phone: string
  }
  bio?: string
  profileImage?: string
  consultationFee?: number
  languages?: string[]
  ratings?: {
    average: number
    count: number
  }
}

const DoctorSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    qualifications: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    licenseNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    availability: {
      monday: [
        {
          start: String,
          end: String,
        },
      ],
      tuesday: [
        {
          start: String,
          end: String,
        },
      ],
      wednesday: [
        {
          start: String,
          end: String,
        },
      ],
      thursday: [
        {
          start: String,
          end: String,
        },
      ],
      friday: [
        {
          start: String,
          end: String,
        },
      ],
      saturday: [
        {
          start: String,
          end: String,
        },
      ],
      sunday: [
        {
          start: String,
          end: String,
        },
      ],
    },
    contactInfo: {
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },
    bio: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
    },
    consultationFee: {
      type: Number,
      min: 0,
    },
    languages: [
      {
        type: String,
        trim: true,
      },
    ],
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  { timestamps: true },
)

export default mongoose.models.Doctor || mongoose.model<IDoctor>("Doctor", DoctorSchema)

