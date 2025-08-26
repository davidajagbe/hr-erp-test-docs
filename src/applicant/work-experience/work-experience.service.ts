import { ApiError, ApiSuccess } from "../../../utils/response-handler.js";
import { ApplicantService } from "../applicant.service.js";
import type {
  AddWorkExperienceDTO,
  UpdateWorkExperienceDTO,
} from "./work-experience.schema.js";

export class WorkExperienceService {
  static async addWorkExperience(
    applicantId: string,
    workExperienceData: AddWorkExperienceDTO[]
  ) {
    const applicant = await ApplicantService.getApplicantDocument(applicantId);

    const normalized = workExperienceData.map((w) => ({
      ...w,
      applicant: applicant._id,
      endDate: w.currentlyWorking ? undefined : w.endDate,
    }));

    applicant.workExperience.push(...(normalized as any));
    await applicant.save();

    return ApiSuccess.ok("Work experience added successfully", {
      workExperience: applicant.workExperience,
    });
  }

  static async updateWorkExperience({
    applicantId,
    workExperienceId,
    workExperienceData,
  }: {
    applicantId: string;
    workExperienceId: string;
    workExperienceData: UpdateWorkExperienceDTO;
  }) {
    const applicant = await ApplicantService.getApplicantDocument(applicantId);

    const exp = applicant.workExperience.find(
      (w: any) => w._id?.toString() === workExperienceId
    );
    if (!exp) throw ApiError.notFound("Work experience not found");

    if (
      workExperienceData.currentlyWorking === false &&
      workExperienceData.endDate == null
    ) {
      throw ApiError.badRequest(
        "endDate is required when setting currentlyWorking to false"
      );
    }

    if (workExperienceData.currentlyWorking === true) {
      (workExperienceData as any).endDate = undefined;
    }

    Object.assign(exp, workExperienceData);
    await applicant.save();

    return ApiSuccess.ok("Work experience updated successfully", {
      workExperience: applicant.workExperience,
    });
  }

  static async deleteWorkExperience({
    applicantId,
    workExperienceId,
  }: {
    applicantId: string;
    workExperienceId: string;
  }) {
    const applicant = await ApplicantService.getApplicantDocument(applicantId);

    const before = applicant.workExperience.length;
    applicant.workExperience = applicant.workExperience.filter(
      (w: any) => w._id?.toString() !== workExperienceId
    );

    if (applicant.workExperience.length === before) {
      throw ApiError.notFound("Work experience not found");
    }

    await applicant.save();
    return ApiSuccess.noContent("Removed work experience", {
      workExperience: applicant.workExperience,
    });
  }

  static async getWorkExperienceById({
    applicantId,
    workExperienceId,
  }: {
    applicantId: string;
    workExperienceId: string;
  }) {
    const applicant = await ApplicantService.getApplicantDocument(applicantId);

    if (!applicant) throw ApiError.notFound("Applicant not found");

    const workExperience = applicant.workExperience.find(
      (w: any) => w._id?.toString() === workExperienceId
    );
    if (!workExperience) {
      throw ApiError.notFound("Work experience not found");
    }

    return ApiSuccess.ok("Work experience retrieved successfully", {
      workExperience,
    });
  }

  static async getApplicantWorkExperience(applicantId: string) {
    const applicant = await ApplicantService.getApplicantDocument(applicantId);
    return ApiSuccess.ok("Applicant work experience retrieved successfully", {
      workExperience: applicant.workExperience,
    });
  }
}
