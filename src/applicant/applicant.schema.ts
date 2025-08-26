import type { NextFunction, Request, Response } from "express";
import { z } from "zod/v4";
import { ApiError } from "../../utils/response-handler";

export class ApplicantSchemas {
  static update = z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phoneNumber: z.string().optional(),
      country: z.string().optional(),
      state: z.string().optional(),
      lga: z.string().optional(),
      postalCode: z.string().optional(),
      age: z.coerce.number().optional(),
      dateOfBirth: z.string().optional(),
      gender: z.enum(["male", "female", "other"]).optional(),
      address: z.string().optional(),
      nin: z.string().optional(),
      bvn: z.string().optional(),
      canTakeAssessment: z.boolean().optional(),
    })
    .strict();

  static scheduleInterview = z
    .object({
      sender: z.email(),
      receiver: z.email(),
      bcc: z.array(z.email()).optional(),
      title: z.string(),
      content: z.string(),
    })
    .strict();

  static validateFiles = (req: Request, res: Response, next: NextFunction) => {
    if (!req.files) {
      return next();
    }

    const avatar = req.files["avatar"];
    const resume = req.files["resume"];

    if (Array.isArray(avatar)) {
      throw ApiError.badRequest("Only one file can be uploaded at a time.");
    }

    if (Array.isArray(resume)) {
      throw ApiError.badRequest("Only one file can be uploaded at a time.");
    }

    const allowedMimeTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const allowedResumeMimeTypes = ["application/pdf"];

    if (avatar && !allowedMimeTypes.includes(avatar.mimetype)) {
      throw ApiError.badRequest(`Invalid file type: ${avatar.mimetype})`);
    }

    if (resume && !allowedResumeMimeTypes.includes(resume.mimetype)) {
      throw ApiError.badRequest(`Invalid file type: ${resume.mimetype})`);
    }

    next();
  };

  static applicantParams = z.object({
    expId: z
      .string()
      .min(1, "Experience id is required")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid experience id"),
  });
}

export type ApplicantUpdateDTO = z.infer<typeof ApplicantSchemas.update>;
export type ApplicantScheduleInterviewDTO = z.infer<
  typeof ApplicantSchemas.scheduleInterview
>;
