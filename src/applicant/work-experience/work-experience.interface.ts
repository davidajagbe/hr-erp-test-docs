import type { Document, Types } from "mongoose";

export interface WorkExperienceInterface extends Document {
  _id: Types.ObjectId;
  applicant: Types.ObjectId;
  jobTitle: string;
  employmentType: "full-time" | "part-time" | "contract" | "internship";
  company: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  workType: "remote" | "on-site" | "hybrid";
  description: string;
  currentlyWorking?: boolean;
}
