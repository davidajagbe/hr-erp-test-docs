import express from "express";
import { isAuth } from "../../middleware/auth.js";
import methodNotAllowed from "../../middleware/method-not-allowed.js";
import { ApplicantController } from "./applicant.controller.js";
import applicantProfileRouter from "./applicant-profile/applicant-profile.routes.js";

const router = express.Router();

/**
 * ================================
 * GENERAL ROUTES
 * ================================
 */

router
  .route("/")
  .get(isAuth, ApplicantController.getAllApplicants)
  .all(methodNotAllowed);

router.use("/profile", applicantProfileRouter);

router
  .route("/:applicantId")
  .get(isAuth, ApplicantController.getApplicant)
  .put(isAuth, ApplicantController.updateApplicant)
  .all(methodNotAllowed);

router
  .route("/:applicantId/schedule-interview")
  .post(isAuth, ApplicantController.scheduleInterview)
  .all(methodNotAllowed);

export default router;
