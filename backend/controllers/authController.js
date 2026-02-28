import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // ✅ Add JWT
import Seller from "../models/sellerModel.js";
import Builder from "../models/builderModel.js";
import Truck from "../models/truckModel.js";
import Admin from "../models/adminModel.js";
import dotenv from "dotenv";
dotenv.config();

export const loginUser = async (req, res) => {
  try {
    const { loginId, password, role } = req.body;

    if (!loginId || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    let Model;
    switch (role) {
      case "Seller": Model = Seller; break;
      case "Builder": Model = Builder; break;
      case "Truck": Model = Truck; break;
      case "Admin": Model = Admin; break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    const user = await Model.findOne({ loginId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: role },
      process.env.JWT_SECRET ,
      { expiresIn: "7d" } // token valid for 7 days
    );

    res.status(200).json({
      message: "Login successful",
      role,
      userId: user._id,
      token, // ✅ Send token to frontend
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};