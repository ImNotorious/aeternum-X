import mongoose, { Schema, type Document } from "mongoose"

export interface IAmbulance extends Document {
  hospitalId: mongoose.Types.ObjectId
  ambulanceId: string
  type: "basic" | "advanced" | "mobile-icu" | "neonatal" | "patient-transport"
  status: "available" | "dispatched" | "en-route" | "at-scene" | "returning" | "maintenance" | "out-of-service"
  capacity: number
  crew?: mongoose.Types.ObjectId[]
  equipment?: string[]
  location?: {
    coordinates: {
      latitude: number
      longitude: number
    }
    lastUpdated: Date
  }
  currentEmergency?: mongoose.Types.ObjectId
  maintenanceSchedule?: {
    lastMaintenance: Date
    nextMaintenance: Date
    maintenanceType: string
    notes?: string
  }
  vehicleDetails: {
    make: string
    model: string
    year: number
    licensePlate: string
    vin?: string
  }
}

const AmbulanceSchema: Schema = new Schema(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    ambulanceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["basic", "advanced", "mobile-icu", "neonatal", "patient-transport"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "dispatched", "en-route", "at-scene", "returning", "maintenance", "out-of-service"],
      default: "available",
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    crew: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    equipment: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      coordinates: {
        latitude: {
          type: Number,
        },
        longitude: {
          type: Number,
        },
      },
      lastUpdated: {
        type: Date,
      },
    },
    currentEmergency: {
      type: Schema.Types.ObjectId,
      ref: "EmergencyCall",
    },
    maintenanceSchedule: {
      lastMaintenance: {
        type: Date,
      },
      nextMaintenance: {
        type: Date,
      },
      maintenanceType: {
        type: String,
        trim: true,
      },
      notes: {
        type: String,
        trim: true,
      },
    },
    vehicleDetails: {
      make: {
        type: String,
        required: true,
        trim: true,
      },
      model: {
        type: String,
        required: true,
        trim: true,
      },
      year: {
        type: Number,
        required: true,
      },
      licensePlate: {
        type: String,
        required: true,
        trim: true,
      },
      vin: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true },
)

export default mongoose.models.Ambulance || mongoose.model<IAmbulance>("Ambulance", AmbulanceSchema)

