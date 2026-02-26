import Seller from "../models/sellerModel.js";
// import jwt from "jsonwebtoken";


// // 🔐 Generate JWT Token (Merged Here)
// const generateToken = (sellerId) => {
//   return jwt.sign(
//     { id: sellerId },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );
// };



// 🔹 Register Seller
export const registerSeller = async (req, res) => {
  try {
    const { name, organization, address, phone, loginId, password } = req.body;

    const existingSeller = await Seller.findOne({ loginId });

    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: "Login ID already exists",
      });
    }

    const seller = await Seller.create({
      name,
      organization,
      address,
      phone,
      loginId,
      password, // will hash automatically (pre-save hook)
    });

    const token = generateToken(seller._id);

    res.status(201).json({
      success: true,
      message: "Seller registered successfully",
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        organization: seller.organization,
        role: seller.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// 🔹 Login Seller
export const loginSeller = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    const seller = await Seller.findOne({ loginId }).select("+password");

    if (!seller) {
      return res.status(401).json({
        success: false,
        message: "Invalid login ID",
      });
    }

    if (seller.blocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked",
      });
    }

    const isMatch = await seller.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = generateToken(seller._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        organization: seller.organization,
        role: seller.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// 🔹 Get Seller Profile (Protected)
export const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    res.status(200).json({
      success: true,
      seller,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};