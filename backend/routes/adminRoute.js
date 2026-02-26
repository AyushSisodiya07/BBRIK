import express from "express";
const router = express.Router();
import { getAllUsers ,addUser,deleteUser,toggleBlockUser} from "../controllers/adminUserController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

router.get("/users",verifyToken, getAllUsers);
router.post("/users/add",verifyToken, addUser);
router.delete("/users/delete/:role/:id", verifyToken, deleteUser);
router.patch("/users/block/:role/:id", verifyToken, toggleBlockUser);




export default router;