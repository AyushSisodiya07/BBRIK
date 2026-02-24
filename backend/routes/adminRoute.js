import express from "express";
const router = express.Router();
import { getAllUsers ,addUser,deleteUser,toggleBlockUser} from "../controllers/adminUserController.js";


router.get("/users", getAllUsers);
router.post("/users/add", addUser);
router.delete("/users/delete/:role/:id", deleteUser);
router.patch("/users/block/:role/:id", toggleBlockUser);




export default router;