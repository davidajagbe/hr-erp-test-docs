import { Router } from "express";
import { GuarantorController } from "./guarantor.controller.ts";

const guarantorRouter = Router();


guarantorRouter.post("/send-invite", GuarantorController.sendInvite);
guarantorRouter.post("/submit-form", GuarantorController.submitForm);

export default guarantorRouter;
