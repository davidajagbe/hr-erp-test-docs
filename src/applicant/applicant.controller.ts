import type { Request, Response } from "express";
import { ApplicantService } from "./applicant.service.js";
import type { UploadedFile } from "express-fileupload";

export class ApplicantController {
  static async getAllApplicants(req: Request, res: Response) {
    const query = req.query;
    const result = await ApplicantService.getAllApplicants(query);
    res.status(200).json(result);
  }
  static async getApplicant(req: Request, res: Response) {
    const { applicantId } = req.params;
    const result = await ApplicantService.getApplicant(applicantId as string);
    res.status(200).json(result);
  }

  static async updateApplicant(req: Request, res: Response) {
    const { applicantId } = req.params as { applicantId: string };
    const applicantData = req.body;
    const files = req.files as { resume?: UploadedFile; avatar?: UploadedFile };
    const result = await ApplicantService.updateApplicant(
      applicantId,
      applicantData,
      files
    );
    res.status(result.status_code).json(result);
  }

  static async scheduleInterview(req: Request, res: Response) {
    const { applicantId } = req.params as { applicantId: string };
    const interviewData = req.body;
    const result = await ApplicantService.scheduleInterview(
      applicantId,
      interviewData
    );
    res.status(result.status_code).json(result);
  }
}
