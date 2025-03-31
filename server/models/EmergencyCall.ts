import mongoose, { Schema, type Document } from "mongoose"

export interface IEmergencyCall extends Document {
  patientId?: mongoose.Types.ObjectId
  hospitalId: mongoose.Types.ObjectId
  callerName?: string
  callerPhone?: string
  location: {
    address?: string
    coordinates: {
      latitude: number
      longitude: number
    }
  }
  emergencyType: string
  description: string
  status: "active" | "dispatched" | "en-route" | "arrived" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "critical"
  timeReceived: Date
  timeDispatched?: Date
  timeArrived?: Date
  timeCompleted?: Date
  assignedAmbulance?: mongoose.Types.ObjectId
  assignedPersonnel?: mongoose.Types.ObjectId[]
  trafficAlertSent?: boolean
  notes?: string
}

const EmergencyCallSchema: Schema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    callerName: {
      type: String,
      trim: true,
    },
    callerPhone: {
      type: String,
      trim: true,
    },
    location: {
      address: {
        type: String,
        trim: true,
      },
      coordinates: {
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
      },
    },
    emergencyType: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "dispatched", "en-route", "arrived", "completed", "cancelled"],
      default: "active",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    timeReceived: {
      type: Date,
      default: Date.now,
      required: true,
    },
    timeDispatched: {
      type: Date,
    },
    timeArrived: {
      type: Date,
    },
    timeCompleted: {
      type: Date,
    },
    assignedAmbulance: {
      type: Schema.Types.ObjectId,
      ref: "Ambulance",
    },
    assignedPersonnel: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    trafficAlertSent: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
)

export default mongoose.models.EmergencyCall || mongoose.model<IEmergencyCall>("EmergencyCall", EmergencyCallSchema)

