import type { NextFunction, Request, Response } from "express";
import { z } from "zod/v4";
import { ApiError } from "../../../utils/response-handler";
import { ParserService } from "../../../services/parser.service";
import Job from "../../../modules/job/job.model";

export class ApplicantProfileSchemas {
  static signup = z
    .object({
      firstName: z.string({ error: "First name is required" }).min(1),
      lastName: z.string({ error: "Last name is required" }).min(1),
      email: z.email({ error: "Please provide a valid email address" }),
      password: z
        .string({ error: "Password is required" })
        .min(5, { error: "Password must be at least 5 characters long" }),
      gender: z.enum(["male", "female", "other"], {
        error: (issue) => {
          if (issue.input === undefined) {
            return "Gender is required";
          }
          return "Invalid gender value";
        },
      }),
      phoneNumber: z.string().optional(),
      state: z.string().optional(),
      lga: z.string().optional(),
      age: z.coerce.number().optional(),
      address: z.string().optional(),
      nin: z.string().optional(),
      bvn: z.string().optional(),
    })
    .strict();

  static login = z
    .object({
      email: z.email({ error: "Please provide a valid email address" }),
      password: z
        .string({ error: "Password is required" })
        .min(5, { error: "Password must be at least 5 characters long" }),
    })
    .strict();

  static verifyOTP = z
    .object({
      email: z.email({ error: "Please provide a valid email address" }),
      otp: z
        .string({ error: "OTP is required" })
        .min(4, { error: "OTP must be at least 4 characters long" }),
    })
    .strict();

  static sendOTP = z
    .object({
      email: z.email({ error: "Please provide a valid email address" }),
    })
    .strict();

  static forgotPassword = z
    .object({
      email: z.email({ error: "Please provide a valid email address" }),
    })
    .strict();

  static resetPassword = z
    .object({
      email: z.email({ error: "Please provide a valid email address" }),
      otp: z
        .string({ error: "OTP is required" })
        .min(4, { error: "OTP must be at least 4 characters long" }),
      password: z
        .string({ error: "Password is required" })
        .min(5, { error: "Password must be at least 5 characters long" }),
    })
    .strict();

  static updateProfile = z
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
      workExperience: z.preprocess(
        (value) => {
          if (value === undefined || value === null) return value;
          if (typeof value === "string") {
            return ParserService.parseArray(value);
          }
          if (Array.isArray(value)) {
            return value;
          }
          throw new Error("Invalid value for workExperience");
        },
        z
          .array(
            z.object({
              jobTitle: z.string(),
              employmentType: z.enum(["full-time", "part-time", "contract"]),
              company: z.string(),
              location: z.string().default(""),
              workType: z.enum(["remote", "on-site", "hybrid"]),
              description: z.string().default(""),
              currentlyWorking: z.boolean().default(false),
              startDate: z.coerce.date(),
              endDate: z.coerce.date().optional(),
            })
          )
          .optional()
      ),
      skills: z.preprocess((value) => {
        if (value === undefined || value === null) return value;
        if (typeof value === "string") {
          return ParserService.parseArray(value);
        }
        if (Array.isArray(value)) {
          return value;
        }
        throw new Error("Invalid value for skills");
      }, z.array(z.string()).optional()),
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
}

export type ApplicantRegisterDTO = z.infer<
  typeof ApplicantProfileSchemas.signup
>;
export type ApplicantLoginDTO = z.infer<typeof ApplicantProfileSchemas.login>;
export type ApplicantVerifyOTPDTO = z.infer<
  typeof ApplicantProfileSchemas.verifyOTP
>;
export type ApplicantSendOTPDTO = z.infer<
  typeof ApplicantProfileSchemas.sendOTP
>;
export type ApplicantForgotPasswordDTO = z.infer<
  typeof ApplicantProfileSchemas.forgotPassword
>;
export type ApplicantResetPasswordDTO = z.infer<
  typeof ApplicantProfileSchemas.resetPassword
>;
export type ApplicantUpdateProfileDTO = z.infer<
  typeof ApplicantProfileSchemas.updateProfile
>;
