import express from "express";
import {
  addProduct,
  getSellerProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { verifyToken} from "../middleware/authMiddleware.js";
import upload from "../middleware/cloudinaryStorage.js";


const router = express.Router();
router.post("/products/add", verifyToken,upload.array("images", 5), addProduct);
router.get("/:id", verifyToken,getSellerProducts);
router.patch("/update/:id", verifyToken,upload.array("images",5), updateProduct);
router.delete("/delete/:id", verifyToken, deleteProduct);


export default router;