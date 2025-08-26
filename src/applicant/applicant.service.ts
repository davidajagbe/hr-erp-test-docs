import { ApiError, ApiSuccess } from "../../utils/response-handler.js";
import type { ApplicantInterface } from "./applicant.interface.js";
import Applicant from "./applicant.model.js";
import type { IQueryParams } from "../../shared/interfaces/query.interface.js";
import { paginate } from "../../utils/paginate.js";
import type { UploadedFile } from "express-fileupload";
import type {
  ApplicantScheduleInterviewDTO,
  ApplicantUpdateDTO,
} from "./applicant.schema.js";
import { UploadService } from "../../services/upload.service.js";
import { mailService } from "../../services/mail.service.js";

export class ApplicantService {
  private static applicantPayload(applicant: ApplicantInterface) {
    return {
      id: applicant.id,
      email: applicant.email,
      avatar: applicant.avatar,
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      gender: applicant.gender,
      phoneNumber: applicant.phoneNumber,
      country: applicant.country,
      state: applicant.state,
      lga: applicant.lga,
      postalCode: applicant.postalCode,
      age: applicant.age,
      dateOfBirth: applicant.dateOfBirth,
      resume: applicant.resume,
      nin: applicant.nin,
      bvn: applicant.bvn,
      skills: applicant.skills,
      workExperiece: applicant.workExperience,
      canTakeAssessment: applicant?.canTakeAssessment,
      isVerified: applicant.isVerified,
    };
  }

  static async getApplicantDocument(applicantId: string) {
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) throw ApiError.notFound("Applicant not found");
    return applicant;
  }

  static async getApplicant(applicantId: string) {
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) throw ApiError.notFound("Applicant not found");

    const payload = ApplicantService.applicantPayload(applicant);

    return ApiSuccess.ok("Applicant Retrieved", { applicant: payload });
  }

  static async getAllApplicants(query: IQueryParams) {
    const { page = 1, limit = 10 } = query;

    // Crazy query later
    const filterQuery: Record<string, any> = {};

    const { documents: applicants, pagination } =
      await paginate<ApplicantInterface>({
        model: Applicant,
        query: filterQuery,
        page,
        limit,
        sort: { createdAt: -1 },
      });

    return ApiSuccess.ok("Applicants Retrieved", { applicants, pagination });
  }

  static async updateApplicant(
    applicantId: string,
    applicantData: ApplicantUpdateDTO,
    files?: { resume?: UploadedFile; avatar?: UploadedFile }
  ) {
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) throw ApiError.notFound("Applicant not found");

    let uploadedResume: Record<string, string | Date> = applicant.resume
      ? applicant.resume
      : {};
    let uploadedAvatar: Record<string, string | Date> = applicant.avatar
      ? applicant.avatar
      : {};

    let updatePayload = { ...applicantData };

    const { resume, avatar } = files ?? {};

    if (resume && !Array.isArray(resume)) {
      const { secure_url, public_id } = await UploadService.uploadToCloudinary(
        resume.tempFilePath,
        `${applicant.firstName}_${applicant.lastName}_resume.${
          resume.mimetype.split("/")[1]
        }`
      );

      if (secure_url && public_id) {
        uploadedResume = { secure_url, public_id };
      }
    }

    if (avatar && !Array.isArray(avatar)) {
      const { secure_url, public_id } = await UploadService.uploadToCloudinary(
        avatar.tempFilePath,
        `${applicant.firstName}_${applicant.lastName}.${
          avatar.mimetype.split("/")[1]
        }`
      );

      if (secure_url && public_id) {
        uploadedAvatar = { secure_url, public_id };
      }
    }

    const updatedApplicant = await Applicant.findByIdAndUpdate(
      applicantId,
      { ...updatePayload, resume: uploadedResume, avatar: uploadedAvatar },
      { new: true }
    );

    const payload = this.applicantPayload(
      updatedApplicant as ApplicantInterface
    );
    return ApiSuccess.ok("Applicant Updated", { applicant: payload });
  }

  static async scheduleInterview(
    applicantId: string,
    interviewData: ApplicantScheduleInterviewDTO
  ) {
    const { title, content, sender, receiver, bcc } = interviewData;
    const applicant = await this.getApplicantDocument(applicantId);

    const mailInfo = await mailService.sendScheduleInterviewEmail({
      sender: sender,
      bcc,
      firstName: applicant.firstName,
      email: applicant.email || receiver,
      title,
      content,
    });

    console.log({ mailInfo });

    return ApiSuccess.ok("Interview Scheduled. Email Sent");
  }
}
