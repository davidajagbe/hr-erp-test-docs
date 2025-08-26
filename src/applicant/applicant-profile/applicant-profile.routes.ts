import express from "express";
import methodNotAllowed from "../../../middleware/method-not-allowed.js";
import { validateBody } from "../../../middleware/validate-schema";
import { isApplicant } from "../../../middleware/auth.js";
import { ApplicantProfileSchemas } from "./applicant-profile.schemas.js";
import { ApplicantProfileController } from "./applicant-profile.controller.js";

const applicantProfileRouter = express.Router();

applicantProfileRouter
  .route("/")
  .get(isApplicant, ApplicantProfileController.getApplicantProfile)
  .put(
    isApplicant,
    // auditLogger(AuditActions.APPLICANT.UPDATE_PROFILE.code),
    validateBody(ApplicantProfileSchemas.updateProfile),
    ApplicantProfileSchemas.validateFiles,
    ApplicantProfileController.updateApplicantProfile
  )
  .all(methodNotAllowed);

applicantProfileRouter
  .route("/auth/signup")
  .post(
    validateBody(ApplicantProfileSchemas.signup),
    // auditLogger(AuditActions.APPLICANT.SIGNUP.code),
    ApplicantProfileController.signup
  )
  .all(methodNotAllowed);

applicantProfileRouter
  .route("/auth/login")
  .post(
    validateBody(ApplicantProfileSchemas.login),
    // auditLogger(AuditActions.APPLICANT.LOGIN.code),
    ApplicantProfileController.login
  )
  .all(methodNotAllowed);

applicantProfileRouter.get(
  "/auth/validate-user",
  isApplicant,
  ApplicantProfileController.validateApplicant
);

applicantProfileRouter
  .route("/auth/request-otp")
  .post(
    validateBody(ApplicantProfileSchemas.sendOTP),
    ApplicantProfileController.sendOTP
  )
  .all(methodNotAllowed);

applicantProfileRouter
  .route("/auth/verify-otp")
  .post(
    validateBody(ApplicantProfileSchemas.verifyOTP),
    // auditLogger(AuditActions.APPLICANT.OTP_VERIFICATION.code),
    ApplicantProfileController.verifyOTP
  )
  .all(methodNotAllowed);

applicantProfileRouter
  .route("/auth/forgot-password")
  .post(
    validateBody(ApplicantProfileSchemas.forgotPassword),
    // auditLogger(AuditActions.APPLICANT.FORGOT_PASSWORD.code),
    ApplicantProfileController.forgotPassword
  )
  .all(methodNotAllowed);

applicantProfileRouter
  .route("/auth/reset-password")
  .post(
    validateBody(ApplicantProfileSchemas.resetPassword),
    // auditLogger(AuditActions.APPLICANT.RESET_PASSWORD.code),
    ApplicantProfileController.resetPassword
  )
  .all(methodNotAllowed);

applicantProfileRouter
  .route("/auth/logout")
  .post(
    isApplicant,
    // auditLogger(AuditActions.APPLICANT.LOGOUT.code),
    ApplicantProfileController.logout
  )
  .all(methodNotAllowed);

export default applicantProfileRouter;
