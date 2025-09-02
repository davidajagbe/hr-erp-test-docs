import { type Request, type Response } from "express";
import { GuarantorService } from "./guarantor.service.ts";
import type { AuthenticatedApplicant } from "../applicant/applicant.interface.ts";

export class GuarantorController {
  //Get Guarantors
  static async getAllGuarantors(req: Request, res: Response) {
    const query = req.query;
    const response = await GuarantorService.getAllGuarantors(query);
    res.status(response.status_code).json(response);
  }

  //Get Applicant Guarantors
  static async getApplicantGuarantors(req: Request, res: Response) {
    const query = req.query;
    const response = await GuarantorService.getApplicantGuarantors(query);
    res.status(response.status_code).json(response);
  }

  //Get Guarantor
  static async getGuarantor(req: Request, res: Response) {
    const { guarantorId } = req.params;
    const response = await GuarantorService.getGuarantor(guarantorId as string);
    res.status(response.status_code).json(response);
  }

  static async sendInvite(req: Request, res: Response) {
    const applicantId  ="applicant";
    const { email } = req.body;
    const response = await GuarantorService.sendInvite(applicantId, email);
    res.status(response.status_code).json(response);
  }

  static async getInvites(req: Request, res: Response) {
    const { applicantId } = req.applicant as AuthenticatedApplicant;
    const response = await GuarantorService.getInvites(applicantId);
    res.status(response.status_code).json(response);
  }

  static async submitForm(req: Request, res: Response) {
    const { token } = req.query;
    const formData = req.body;
    const response = await GuarantorService.submitForm(
      token as string,
      formData
    );
    res.status(response.status_code).json(response);
  }
}
