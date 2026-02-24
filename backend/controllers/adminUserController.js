import Builder from "../models/builderModel.js";
import Seller from "../models/sellerModel.js";
import Truck from "../models/truckModel.js";
import Architect from "../models/architectModel.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
  try {
    // Fetch all roles in parallel
    const [builders, sellers, trucks, architects] = await Promise.all([
      Builder.find(),
      Seller.find(),
      Truck.find(),
      Architect.find(),
    ]);

    // Add role manually (extra safety if needed)
    const formattedBuilders = builders.map((user) => ({
      ...user._doc,
      role: "Builder",
    }));

    const formattedSellers = sellers.map((user) => ({
      ...user._doc,
      role: "Seller",
    }));

    const formattedTrucks = trucks.map((user) => ({
      ...user._doc,
      role: "Truck",
    }));

    const formattedArchitects = architects.map((user) => ({
      ...user._doc,
      role: "Architect",
    }));

    // Combine all users
    const allUsers = [
      ...formattedBuilders,
      ...formattedSellers,
      ...formattedTrucks,
      ...formattedArchitects,
    ];

    res.status(200).json({
      success: true,
      users: allUsers,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};


export const addUser = async (req, res) => {
  try {
    const {
      name,
      phone,
      organization,
      address,
      role,
      loginId,
      password,
    } = req.body;

    // 🔹 Validation
    if (
      !name ||
      !phone ||
      !organization ||
      !address ||
      !role ||
      !loginId ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let Model;

    switch (role) {
      case "Builder":
        Model = Builder;
        break;
      case "Seller":
        Model = Seller;
        break;
      case "Truck":
        Model = Truck;
        break;
      case "Architect":
        Model = Architect;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid role",
        });
    }

    // 🔹 Check duplicate loginId in that role
    const existingLogin = await Model.findOne({ loginId });
    if (existingLogin) {
      return res.status(400).json({
        success: false,
        message: "Login ID already exists in this role",
      });
    }

    // 🔹 Check duplicate phone in that role
    const existingPhone = await Model.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already used in this role",
      });
    }
const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Model.create({
      name,
      phone,
      organization,
      address,
      role,
      loginId,
      password: hashedPassword, 
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });

  } catch (error) {
    console.error("Add user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { role, id } = req.params;

    let Model;

    switch (role) {
      case "Builder":
        Model = Builder;
        break;
      case "Seller":
        Model = Seller;
        break;
      case "Truck":
        Model = Truck;
        break;
      case "Architect":
        Model = Architect;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid role",
        });
    }

    const deletedUser = await Model.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const toggleBlockUser = async (req, res) => {
  try {
    const { role, id } = req.params;

    let Model;

    switch (role) {
      case "Builder":
        Model = Builder;
        break;
      case "Seller":
        Model = Seller;
        break;
      case "Truck":
        Model = Truck;
        break;
      case "Architect":
        Model = Architect;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid role",
        });
    }

    const user = await Model.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 Toggle blocked status
    user.blocked = !user.blocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.blocked ? "User blocked" : "User unblocked",
      blocked: user.blocked,
    });

  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};