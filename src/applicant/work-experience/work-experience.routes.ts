import express from "express";
import { WorkExperienceSchemas } from "./work-experience.schema";
import {
  validateBody,
  validateParams,
} from "../../../middleware/validate-schema";
import { isApplicant } from "../../../middleware/auth";
import { WorkExperienceController } from "./work-experience.controller";
import methodNotAllowed from "../../../middleware/method-not-allowed";

const router = express.Router();

router
  .route("/")
  .get(isApplicant, WorkExperienceController.getApplicantWorkExperience)
  .post(
    validateBody(WorkExperienceSchemas.addWorkExperience),
    isApplicant,
    WorkExperienceController.addWorkExperience
  )
  .all(methodNotAllowed);

router
  .route("/:workExperienceId")
  .put(
    validateParams(WorkExperienceSchemas.applicantParams),
    validateBody(WorkExperienceSchemas.updateWorkExperience),
    isApplicant,
    WorkExperienceController.updateWorkExperience
  )
  .get(isApplicant, WorkExperienceController.getWorkExperienceById)
  .delete(
    isApplicant,
    validateParams(WorkExperienceSchemas.applicantParams),
    WorkExperienceController.deleteWorkExperience
  )
  .all(methodNotAllowed);

export default router;
