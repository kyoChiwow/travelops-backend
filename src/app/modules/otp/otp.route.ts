import { Router } from "express";
import { OtpControllers } from "./otp.controller";

const router = Router();

router.post("/send", OtpControllers.sendOTP);
router.post("/verify", OtpControllers.verifyOTP);


export const OtpRoutes = router;