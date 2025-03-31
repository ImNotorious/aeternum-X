import mongoose, { Schema, type Document } from "mongoose"

export interface IMedicalRecord extends Document {
  patientId: mongoose.Types.ObjectId
  doctorId: mongoose.Types.ObjectId
  hospitalId: mongoose.Types.ObjectId
  recordType: "diagnosis" | "prescription" | "lab-result" | "imaging" | "note"
  title: string
  description: string
  date: Date
  attachments?: string[]
  diagnosis?: {
    condition: string
    icd10Code?: string
    severity?: "mild" | "moderate" | "severe"
    notes?: string
  }
  prescription?: {
    medications: {
      name: string
      dosage: string
      frequency: string
      duration: string
      instructions?: string
    }[]
    refillable: boolean
    refillCount?: number
  }
  labResult?: {
    testName: string
    testDate: Date
    resultDate: Date
    parameters: {
      name: string
      value: string
      unit?: string
      normalRange?: string
      isAbnormal?: boolean
    }[]
    summary?: string
  }
  imaging?: {
    type: string
    bodyPart: string
    findings: string
    impression?: string
    imageUrls?: string[]
  }
  isEncrypted: boolean
  blockchainReference?: string
  accessControl: {
    publiclyAccessible: boolean
    authorizedUsers?: mongoose.Types.ObjectId[]
    authorizedHospitals?: mongoose.Types.ObjectId[]
  }
}

const MedicalRecordSchema: Schema = new Schema(
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
    recordType: {
      type: String,
      enum: ["diagnosis", "prescription", "lab-result", "imaging", "note"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    attachments: [
      {
        type: String,
      },
    ],
    diagnosis: {
      condition: {
        type: String,
        trim: true,
      },
      icd10Code: {
        type: String,
        trim: true,
      },
      severity: {
        type: String,
        enum: ["mild", "moderate", "severe"],
      },
      notes: {
        type: String,
        trim: true,
      },
    },
    prescription: {
      medications: [
        {
          name: {
            type: String,
            trim: true,
          },
          dosage: {
            type: String,
            trim: true,
          },
          frequency: {
            type: String,
            trim: true,
          },
          duration: {
            type: String,
            trim: true,
          },
          instructions: {
            type: String,
            trim: true,
          },
        },
      ],
      refillable: {
        type: Boolean,
        default: false,
      },
      refillCount: {
        type: Number,
        min: 0,
      },
    },
    labResult: {
      testName: {
        type: String,
        trim: true,
      },
      testDate: {
        type: Date,
      },
      resultDate: {
        type: Date,
      },
      parameters: [
        {
          name: {
            type: String,
            trim: true,
          },
          value: {
            type: String,
            trim: true,
          },
          unit: {
            type: String,
            trim: true,
          },
          normalRange: {
            type: String,
            trim: true,
          },
          isAbnormal: {
            type: Boolean,
            default: false,
          },
        },
      ],
      summary: {
        type: String,
        trim: true,
      },
    },
    imaging: {
      type: {
        type: String,
        trim: true,
      },
      bodyPart: {
        type: String,
        trim: true,
      },
      findings: {
        type: String,
        trim: true,
      },
      impression: {
        type: String,
        trim: true,
      },
      imageUrls: [
        {
          type: String,
        },
      ],
    },
    isEncrypted: {
      type: Boolean,
      default: true,
    },
    blockchainReference: {
      type: String,
    },
    accessControl: {
      publiclyAccessible: {
        type: Boolean,
        default: false,
      },
      authorizedUsers: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      authorizedHospitals: [
        {
          type: Schema.Types.ObjectId,
          ref: "Hospital",
        },
      ],
    },
  },
  { timestamps: true },
)

export default mongoose.models.MedicalRecord || mongoose.model<IMedicalRecord>("MedicalRecord", MedicalRecordSchema)

