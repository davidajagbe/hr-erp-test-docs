import type { Document, Types } from "mongoose";
import type { GuarantorInterface } from "../guarantor/guarantor.interface";
import type { WorkExperienceInterface } from "./work-experience/work-experience.interface";

export enum AssessmentStageEnum {
  UNASSIGNED = "UNASSIGNED",
  ASSIGNED = "ASSIGNED",
  PASSED = "PASSED",
  CLOSED = "CLOSED",
  UNDERGOING = "UNDERGOING",
  FAILED = "FAILED",
  LOCKED = "LOCKED",
}

export interface ApplicantInterface extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string | undefined;
  gender: "male" | "female" | "other";
  avatar: {
    public_id?: string;
    secure_url?: string;
    uploadedAt?: Date;
  };
  address: string;
  country: string;
  state: string;
  lga: string;
  postalCode: string;
  passwordVersion: number;
  isActive: boolean;
  isVerified: boolean;
  age: number;
  dateOfBirth: string;
  phoneNumber?: string;
  nin?: string;
  bvn?: string;
  resume?: {
    public_id?: string;
    secure_url?: string;
    uploadedAt?: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
  canTakeAssessment: boolean;
  assessmentAssignment: Types.ObjectId;
  guarantors: GuarantorInterface[];
  workExperience: WorkExperienceInterface[];
  skills: string[];
  isAssessmentCompleted: boolean;
  assessmentStage: AssessmentStageEnum;
  assessmentLockedUntil: Date | null;
}

export interface AuthenticatedApplicant {
  applicantId: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface ApplicantOTPData {
  email: string;
  otp: string;
}

