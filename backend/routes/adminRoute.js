import express from "express";
const router = express.Router();
import { loginAdmin } from "../controllers/adminController.js";

router.post("/login", loginAdmin);

export default router;