import { Schema, Types, model } from "mongoose";
import {
  AssessmentStageEnum,
  type ApplicantInterface,
} from "./applicant.interface";
import WorkExperienceSchema from "./work-experience/work-experience.model";

const applicantSchema = new Schema<ApplicantInterface>(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, "Please provide an email address"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [5, "Password must be at least 5 characters long"],
      select: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Please provide a gender"],
    },
    phoneNumber: {
      type: String,
      match: [
        /^(0)(7|8|9){1}(0|1){1}[0-9]{8}$/,
        "Please enter a valid Nigerian phone number",
      ],
      default: "",
    },
    avatar: {
      type: {
        public_id: {type: String},
        secure_url: {type: String},
        uploadedAt: {type: Date},
      },
      default: {
        public_id: "",
        secure_url:
          "https://res.cloudinary.com/demmgc49v/image/upload/v1695969739/default-avatar_scnpps.jpg",
        uploadedAt: new Date(),
      },
    },
    address: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    lga: {
      type: String,
      default: "",
    },
    postalCode: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      default: 0,
    },
    dateOfBirth: {
      type: String,
      default: "",
    },
    resume: {
      type: {
        public_id: {type: String},
        secure_url: {type: String},
        uploadedAt: {type: Date},
      },
      default: {
        public_id: "",
        secure_url: "",
        uploadedAt: new Date(),
      },
    },
    nin: {
      type: String,
      // unique: true,
      // sparse: true,
      default: "",
    },
    bvn: {
      type: String,
      // unique: true,
      // sparse: true,
      default: "",
    },
    passwordVersion: {
      type: Number,
      default: 1,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    canTakeAssessment: {
      type: Boolean,
      default: false,
    },
    assessmentAssignment: {
      type: Schema.Types.ObjectId,
      ref: "AssessmentAssignment",
      default: null,
    },
    guarantors: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Guarantor",
        },
      ],
      default: [],
      validate: {
        validator: function (arr: Types.ObjectId[]) {
          return arr.length <= 3;
        },
        message: "{PATH} exceeds maximum of 3 guarantors",
      },
    },
    workExperience: {
      type: [
        {
          jobTitle: {type: String, required: true},
          employmentType: {
            type: String,
            enum: ["full-time", "part-time", "contract", "internship"],
            required: true,
          },
          company: {type: String, required: true},
          startDate: {type: Date, required: true},
          endDate: {type: Date},
          location: {type: String, required: true},
          workType: {
            type: String,
            enum: ["remote", "on-site", "hybrid"],
            required: true,
          },
          description: {type: String, default: ""},
          currentlyWorking: {type: Boolean, default: false},
        },
      ],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    isAssessmentCompleted: {type: Boolean, default: false},
    assessmentStage: {
      type: String,
      enum: Object.values(AssessmentStageEnum),
      default: AssessmentStageEnum.UNASSIGNED,
    },
    assessmentLockedUntil: {
      type: Date,
      default: null,
    },
  },
  {timestamps: true}
);

const Applicant = model<ApplicantInterface>("Applicant", applicantSchema);
export default Applicant;
