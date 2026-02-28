import jwt from "jsonwebtoken";
<<<<<<< HEAD
import Seller from "../models/sellerModel.js";

export const protectSeller = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const seller = await Seller.findById(decoded.id);

    if (!seller) {
      return res.status(401).json({
        success: false,
        message: "Seller not found",
      });
    }

    if (seller.blocked) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked",
      });
    }

    req.seller = seller; // 🔥 Important
    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
=======

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Format: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    next(); // allow request
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
>>>>>>> 19f2665baf5fab9d8b4e828cfecdbd600e266626
  }
};