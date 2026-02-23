import express from "express";
import { sendOtp, verifyOtp } from "../controllers/customerController.js";

const router = express.Router();

router.post("/auth/send-otp", sendOtp);
router.post("/auth/verify-otp", verifyOtp);

export default router;