import { Schema, model } from "mongoose";
import type {
  GuarantorInterface,
  GuarantorInvitationInterface,
} from "./guarantor.interface";

const guarantorSchema = new Schema<GuarantorInterface>({
  applicant: {
    type: Schema.Types.ObjectId,
    ref: "Applicant",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  relationship: {
    type: String,
    required: true,
  },
  filledAt: {
    type: Date,
    default: Date.now,
  },
});

const guarantorInvitationSchema = new Schema<GuarantorInvitationInterface>({
  applicant: {
    type: Schema.Types.ObjectId,
    ref: "Applicant",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  link: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "expired"],
    default: "pending",
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
});

export const Guarantor = model<GuarantorInterface>(
  "Guarantor",
  guarantorSchema
);
export const GuarantorInvitation = model<GuarantorInvitationInterface>(
  "GuarantorInvitation",
  guarantorInvitationSchema
);
