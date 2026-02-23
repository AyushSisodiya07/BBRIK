import Customer from "../models/customerModel.js";
import jwt from "jsonwebtoken";

const OTP_EXP_MIN = 5;

function generateOtp() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function sendOtp(req, res) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone required" });
    }

    let user = await Customer.findOne({ phone });
    if (!user) user = await Customer.create({ phone });

    user.otp = generateOtp();
    user.otpExpiresAt = new Date(Date.now() + OTP_EXP_MIN * 60 * 1000);
    await user.save();

    console.log("OTP (DEV):", user.otp);

    res.json({ success: true, message: "OTP sent" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { phone, otp } = req.body;
    const user = await Customer.findOne({ phone });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired" });
    }

    if (user.otp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    user.isPhoneVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        onboardingComplete: user.onboardingComplete,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}