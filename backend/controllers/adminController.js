import Admin from "../models/adminModel.js";
import bcrypt from "bcrypt";

export const loginAdmin = async (req, res) => {
  try { 
    const { adminId, password } = req.body;

    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};