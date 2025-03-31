import mongoose, { Schema, type Document } from "mongoose"

export interface IHospital extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  type: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  coordinates?: {
    latitude: number
    longitude: number
  }
  contactInfo: {
    phone: string
    email: string
    website?: string
  }
  emergencyServices: boolean
  departments?: string[]
  facilities?: string[]
  ambulanceCount?: number
  bedCapacity?: number
  accreditations?: string[]
  operatingHours?: {
    isOpen24Hours: boolean
    regularHours?: {
      monday: string
      tuesday: string
      wednesday: string
      thursday: string
      friday: string
      saturday: string
      sunday: string
    }
  }
}

const HospitalSchema: Schema = new Schema(
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
    type: {
      type: String,
      required: true,
      enum: ["general", "specialty", "clinic", "trauma", "teaching", "community", "rehabilitation"],
    },
    address: {
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      zipCode: {
        type: String,
        required: true,
        trim: true,
      },
      country: {
        type: String,
        required: true,
        trim: true,
      },
    },
    coordinates: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    contactInfo: {
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      website: {
        type: String,
        trim: true,
      },
    },
    emergencyServices: {
      type: Boolean,
      default: false,
    },
    departments: [
      {
        type: String,
        trim: true,
      },
    ],
    facilities: [
      {
        type: String,
        trim: true,
      },
    ],
    ambulanceCount: {
      type: Number,
      min: 0,
    },
    bedCapacity: {
      type: Number,
      min: 0,
    },
    accreditations: [
      {
        type: String,
        trim: true,
      },
    ],
    operatingHours: {
      isOpen24Hours: {
        type: Boolean,
        default: false,
      },
      regularHours: {
        monday: String,
        tuesday: String,
        wednesday: String,
        thursday: String,
        friday: String,
        saturday: String,
        sunday: String,
      },
    },
  },
  { timestamps: true },
)

export default mongoose.models.Hospital || mongoose.model<IHospital>("Hospital", HospitalSchema)

