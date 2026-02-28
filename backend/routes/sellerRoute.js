<<<<<<< HEAD
// import express from "express";
// import { loginSeller } from "../controllers/sellerController.js";

// const router = express.Router();

// router.post("/login", loginSeller);

// export default router;
import express from "express";
import {
  registerSeller,
  loginSeller,
  getSellerProfile
} from "../controllers/sellerController.js";

import { protectSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerSeller);
router.post("/login", loginSeller);

// 🔐 Protected Route
router.get("/profile", protectSeller, getSellerProfile);
=======
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

>>>>>>> 19f2665baf5fab9d8b4e828cfecdbd600e266626

export default router;