import type { UploadedFile } from "express-fileupload";
import { generateToken } from "../../config/token";
import { mailService } from "../../../services/mail.service";
import { ApiError, ApiSuccess } from "../../../utils/response-handler";
import { comparePassword, hashPassword } from "../../../utils/validationUtils";
import type {
  ApplicantInterface,
  ApplicantOTPData,
} from "../applicant.interface";
import Applicant from "../applicant.model";

import { UploadService } from "../../../services/upload.service";
import { OTPService } from "../../../modules/otp/otp.service";
import OTP from "../../../modules/otp/otp.model";
import type {
  ApplicantLoginDTO,
  ApplicantRegisterDTO,
  ApplicantUpdateProfileDTO,
  ApplicantResetPasswordDTO,
} from "./applicant-profile.schemas";
import { ParserService } from "../../../services/parser.service";

export class ApplicantProfileService {
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
      workExperience: applicant.workExperience,
      canTakeAssessment: applicant?.canTakeAssessment,
      isVerified: applicant.isVerified,
    };
  }

  static async getApplicantDocument(applicantId: string) {
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) throw ApiError.notFound("Applicant not found");
    return applicant;
  }

  static async signup(applicantData: ApplicantRegisterDTO) {
    const { email, password } = applicantData;

    const existing = await Applicant.findOne({ email });
    if (existing) throw ApiError.conflict("Applicant already exists");

    const hashedPassword = await hashPassword(password);

    const applicant = new Applicant({
      ...applicantData,
      password: hashedPassword,
    });

    const emailInfo = await mailService.sendOTPViaEmail(
      applicant.email,
      applicant.firstName
    );

    await applicant.save();

    applicant.password = undefined;

    const applicantPayload = this.applicantPayload(applicant);

    return ApiSuccess.created(
      `Registration Successful. OTP sent to ${emailInfo.envelope.to}`,
      { applicant: applicantPayload }
    );
  }

  static async login(applicantData: ApplicantLoginDTO) {
    const { email, password } = applicantData;

    const applicant = await Applicant.findOne({ email }).select("+password");
    if (!applicant) throw ApiError.notFound("Applicant not found");

    await comparePassword(password, applicant.password as string);

    if (!applicant.isVerified) {
      throw ApiError.forbidden("Email not verified");
    }

    const token = generateToken({
      applicantId: applicant._id,
      passwordVersion: applicant.passwordVersion,
    });

    const payload = ApplicantProfileService.applicantPayload(applicant);

    return ApiSuccess.ok("Login Successful", {
      applicant: payload,
      token,
    });
  }

  static async updateApplicantProfile(
    applicantId: string,
    applicantData: ApplicantUpdateProfileDTO,
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

    // Add Skils
    if (applicantData.skills) {
      const parsedData = ParserService.parseArray(applicantData.skills);

      if (parsedData) {
        updatePayload = { ...updatePayload, skills: parsedData };
      }
    }

    if (applicantData.workExperience) {
      const parsedData = ParserService.parseArray(applicantData.workExperience);

      console.log({ parsedData, workExperience: applicantData.workExperience });

      if (parsedData) {
        updatePayload = { ...updatePayload, workExperience: parsedData };
      }
    }

    const updatedApplicant = await Applicant.findByIdAndUpdate(
      applicantId,
      { ...updatePayload, resume: uploadedResume, avatar: uploadedAvatar },
      { new: true }
    );

    const payload = ApplicantProfileService.applicantPayload(
      updatedApplicant as ApplicantInterface
    );
    return ApiSuccess.ok("Profile Updated", { applicant: payload });
  }

  static async getApplicantProfile(applicantId: string) {
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) throw ApiError.notFound("Applicant not found");

    const payload = ApplicantProfileService.applicantPayload(applicant);

    return ApiSuccess.ok("Profile Retrieved", { applicant: payload });
  }

  static async validateApplicant(applicantId: string) {
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) throw ApiError.notFound("Applicant not found");

    applicant.password = undefined;
    const payload = ApplicantProfileService.applicantPayload(applicant);

    return ApiSuccess.ok("Profile Validated", { applicant: payload });
  }

  static async sendOTP({ email }: { email: string }) {
    const applicant = await Applicant.findOne({ email });
    if (!applicant) throw ApiError.notFound("Applicant not found");

    if (applicant.isVerified) {
      return ApiSuccess.ok("Profile already verified");
    }

    const otpExists = await OTPService.checkIfOtpExists(applicant.email);
    if (otpExists) throw ApiError.badRequest("OTP already sent");

    const emailInfo = await mailService.sendOTPViaEmail(
      applicant.email,
      applicant.firstName
    );

    return ApiSuccess.ok(`OTP sent to ${emailInfo.envelope.to}`);
  }

  static async verifyOTP({ email, otp }: ApplicantOTPData) {
    const applicant = await Applicant.findOne({ email });
    if (!applicant) throw ApiError.notFound("Applicant not found");

    if (applicant.isVerified) {
      return ApiSuccess.ok("Profile already verified");
    }

    const otpExists = await OTP.findOne({ email, otp });
    if (!otpExists) throw ApiError.badRequest("Invalid or expired OTP");

    applicant.isVerified = true;
    await applicant.save();

    return ApiSuccess.ok("Email verified");
  }

  static async forgotPassword({ email }: { email: string }) {
    const applicant = await Applicant.findOne({ email });
    if (!applicant) throw ApiError.notFound("Applicant not found");

    const emailInfo = await mailService.sendOTPViaEmail(applicant.email, "");
    return ApiSuccess.ok(`OTP sent to ${emailInfo.envelope.to}`);
  }

  static async resetPassword({
    email,
    otp,
    password,
  }: ApplicantResetPasswordDTO) {
    const applicant = await Applicant.findOne({ email });
    if (!applicant) throw ApiError.notFound("Applicant not found");

    const otpExists = await OTP.findOne({ email, otp });
    if (!otpExists) throw ApiError.badRequest("Invalid or expired OTP");

    applicant.password = await hashPassword(password);
    await applicant.save();

    return ApiSuccess.ok("Password updated successfully");
  }

  static async logout(applicantId: string) {
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) throw ApiError.notFound("Applicant not found");

    applicant.password = undefined;
    return ApiSuccess.ok("Logout successful");
  }
}
