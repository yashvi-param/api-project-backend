import express from "express";
import auth from "../middleware/auth.js";
import userController from "../controller/userController.js";
const router = express.Router();

//user
router.post("/createUser", userController.addUser);
router.patch("/updateUser/:id", auth, userController.updateUser);
router.delete("/deleteUser/:id", auth, userController.deleteUser);
router.post("/login", userController.login);
router.post("/logout", auth, userController.logOut);
router.post("/logoutAll", userController.logOutAll);

export default router;
