import type { GuarantorInterface } from "./guarantor.interface.ts";
import { Guarantor, GuarantorInvitation } from "./guarantor.model.ts";
import type { IQueryParams } from "../../shared/interfaces/query.interface";
import { paginate } from "../utils/paginate";
import { ApiError, ApiSuccess } from "../utils/response-handler";
import { env } from "../config/env.config.ts";
// import { generateToken, verifyToken } from "../config/token.ts";
import Applicant from "../applicant/applicant.model.ts";

export class GuarantorService {
  static async getAllGuarantors(query: IQueryParams) {
    const { page, limit } = query;

    const { documents: guarantors, pagination } =
      await paginate<GuarantorInterface>({
        model: Guarantor,
        page,
        limit,
        sort: { createdAt: -1 },
      });

    return ApiSuccess.ok("Guarantors fetched successfully", {
      guarantors,
      pagination,
    });
  }

  static async getApplicantGuarantors(query: IQueryParams) {
    const { page, limit } = query;

    const { documents: guarantors, pagination } =
      await paginate<GuarantorInterface>({
        model: Guarantor,
        page,
        limit,
        sort: { createdAt: -1 },
      });

    return ApiSuccess.ok("Guarantors fetched successfully", {
      guarantors,
      pagination,
    });
  }

  static async getGuarantor(guarantorId: string) {
    const guarantor = await Guarantor.findById(guarantorId);
    if (!guarantor) throw ApiError.notFound("Guarantor not found");
    return ApiSuccess.ok("Guarantor fetched successfully", { guarantor });
  }

  static async sendInvite(applicantId: string, email: string) {
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) throw ApiError.notFound("Applicant not found");

    if (applicant.guarantors.length >= 3) {
      throw ApiError.badRequest("Maximum number of guarantors reached");
    }

    const token = generateToken({ applicantId, email });
    const link = `${env.ADMIN_EMAIL}/guarantor-form?token=${token}`;

    // Change later
    const guarantorInvitation = GuarantorInvitation.create({
      applicant: applicantId,
      email,
      token,
      link,
      status: "pending",
      sentAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
    });

    // Send Email

    return ApiSuccess.ok("Guarantor invitation sent successfully", {
      guarantorInvitation,
    });
  }

  static async getInvites(applicantId: string) {
    const guarantorInvitations = await GuarantorInvitation.find({
      applicant: applicantId,
    });
    return ApiSuccess.ok("Guarantor invitations fetched successfully", {
      guarantorInvitations,
    });
  }

  static async submitForm(token: string, formData: any) {
    const { applicantId, email } = verifyToken(token);

    const applicant = await Applicant.findById(applicantId);
    if (!applicant) throw ApiError.notFound("Applicant not found");

    if (applicant.guarantors.length >= 3) {
      throw ApiError.badRequest("Maximum number of guarantors reached");
    }

    if (applicant.guarantors.some((guarantor) => guarantor.email === email)) {
      throw ApiError.badRequest("Guarantor already exists");
    }

    const guarantor = await Guarantor.create({
      ...formData,
      applicant: applicantId,
    });

    const guarantorInvitation = await GuarantorInvitation.findOneAndUpdate(
      { token },
      {
        status: "completed",
        completedAt: new Date(),
      },
      {
        new: true,
      }
    );

    return ApiSuccess.ok("Guarantor added successfully", { guarantor });
  }
}
