import { Router } from "express";
import { GuarantorController } from "./guarantor.controller";

const guarantorRouter = Router();


guarantorRouter.post("/send-invite", GuarantorController.sendInvite);
guarantorRouter.post("/submit-form", GuarantorController.submitForm);

export default guarantorRouter;
