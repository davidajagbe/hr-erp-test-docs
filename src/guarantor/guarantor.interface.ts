import { Document } from "mongoose";
import type { ApplicantInterface } from "../applicant/applicant.interface";

export interface GuarantorInterface extends Document {
  applicant: ApplicantInterface;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  relationship: string;
  filledAt?: Date;
}

export interface GuarantorInvitationInterface extends Document {
  applicant: ApplicantInterface;
  email: string;
  token: string;
  link: string;
  status: "pending" | "completed" | "expired";
  sentAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
}
