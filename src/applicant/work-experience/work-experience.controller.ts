import type { Request, Response } from "express";
import type { AuthenticatedApplicant } from "../applicant.interface";
import { WorkExperienceService } from "./work-experience.service";
import type {
  AddWorkExperienceDTO,
  UpdateWorkExperienceDTO,
} from "./work-experience.schema";

export class WorkExperienceController {
  static async addWorkExperience(req: Request, res: Response) {
    const { applicantId } = req.applicant as AuthenticatedApplicant;
    const { workExperience } = req.body as {
      workExperience: AddWorkExperienceDTO[];
    };
    const result = await WorkExperienceService.addWorkExperience(
      applicantId,
      workExperience
    );
    res.status(result.status_code).json(result);
  }

  static async updateWorkExperience(req: Request, res: Response) {
    const { applicantId } = req.applicant as AuthenticatedApplicant;
    const { workExperienceId } = req.params as { workExperienceId: string };
    const workExperienceData = req.body as UpdateWorkExperienceDTO;
    const result = await WorkExperienceService.updateWorkExperience({
      applicantId,
      workExperienceData,
      workExperienceId,
    });
    res.status(result.status_code).json(result);
  }

  static async getApplicantWorkExperience(req: Request, res: Response) {
    const { applicantId } = req.applicant as AuthenticatedApplicant;
    const result = await WorkExperienceService.getApplicantWorkExperience(
      applicantId
    );
    res.status(result.status_code).json(result);
  }

  static async getWorkExperienceById(req: Request, res: Response) {
    const { applicantId } = req.applicant as AuthenticatedApplicant;
    const { workExperienceId } = req.params as { workExperienceId: string };
    const result = await WorkExperienceService.getWorkExperienceById({
      applicantId,
      workExperienceId,
    });
    res.status(result.status_code).json(result);
  }

  static async deleteWorkExperience(req: Request, res: Response) {
    const { applicantId } = req.applicant as AuthenticatedApplicant;
    const { workExperienceId } = req.params as { workExperienceId: string };
    const result = await WorkExperienceService.deleteWorkExperience({
      applicantId,
      workExperienceId,
    });
    res.status(result.status_code).json(result);
  }
}
