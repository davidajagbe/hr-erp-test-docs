import { Schema } from "mongoose";

const WorkExperienceSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      required: true,
    },
    company: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
      trim: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
      trim: true,
    },
    workType: {
      type: String,
      enum: ["remote", "on-site", "hybrid"],
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
      trim: true,
    },
    currentlyWorking: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

export default WorkExperienceSchema;
