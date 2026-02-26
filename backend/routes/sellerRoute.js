import express from "express";
import {
  addProduct,
  getSellerProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { verifyToken} from "../middleware/authMiddleware.js";


const router = express.Router();
router.post("/products/add", verifyToken, addProduct);
router.get("/:id", verifyToken,getSellerProducts);
router.patch("/update/:id", verifyToken, updateProduct);
router.delete("/delete/:id", verifyToken, deleteProduct);


export default router;