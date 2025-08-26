import type { Request, Response } from "express";
import type { UploadedFile } from "express-fileupload";
import { env } from "../../../config/env.config.js";
import type { AuthenticatedApplicant } from "../applicant.interface.js";
import { ApplicantProfileService } from "./applicant-profile.service.js";

export class ApplicantProfileController {
  static async signup(req: Request, res: Response) {
    const applicantData = req.body;
    const result = await ApplicantProfileService.signup(applicantData);
    res.status(201).json(result);
  }

  static async login(req: Request, res: Response) {
    const applicantData = req.body;
    const result = await ApplicantProfileService.login(applicantData);

    res.cookie("accessToken", result.data.token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24,
      path: "/",
    });

    result.data.token = null as any;
    res.status(200).json(result);
  }

  static async updateApplicantProfile(req: Request, res: Response) {
    const { applicantId } = req.applicant as AuthenticatedApplicant;
    const applicantData = req.body;
    const files = req.files as { resume?: UploadedFile; avatar?: UploadedFile };
    const result = await ApplicantProfileService.updateApplicantProfile(
      applicantId,
      applicantData,
      files
    );
    res.status(result.status_code).json(result);
  }

  static async validateApplicant(req: Request, res: Response) {
    const { applicantId } = req.applicant as AuthenticatedApplicant;
    const result = await ApplicantProfileService.validateApplicant(applicantId);
    res.status(result.status_code).json(result);
  }

  static async getApplicantProfile(req: Request, res: Response) {
    const { applicantId } = req.applicant as AuthenticatedApplicant;
    const result = await ApplicantProfileService.getApplicantProfile(applicantId);
    res.status(200).json(result);
  }

  static async sendOTP(req: Request, res: Response) {
    const { email } = req.body as { email: string };
    const result = await ApplicantProfileService.sendOTP({ email });
    res.status(result.status_code).json(result);
  }

  static async verifyOTP(req: Request, res: Response) {
    const { email, otp } = req.body;
    const result = await ApplicantProfileService.verifyOTP({ email, otp });
    res.status(200).json(result);
  }

  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    const result = await ApplicantProfileService.forgotPassword({ email });
    res.status(200).json(result);
  }

  static async resetPassword(req: Request, res: Response) {
    const { email, otp, password } = req.body;
    const result = await ApplicantProfileService.resetPassword({
      email,
      otp,
      password,
    });
    res.status(200).json(result);
  }

  static async logout(req: Request, res: Response) {
    const { applicantId } = req.applicant as AuthenticatedApplicant;
    const result = await ApplicantProfileService.logout(applicantId);

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json(result);
  }
}
