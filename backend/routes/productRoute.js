import express from "express";
import {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protectSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protectSeller, addProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", protectSeller, updateProduct);
router.delete("/:id", protectSeller, deleteProduct);

export default router;