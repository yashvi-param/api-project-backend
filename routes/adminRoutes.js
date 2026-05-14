import express from "express";

import auth from "../middleware/auth.js";
import userController from "../controller/userController.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

router.get(
  "/getUser",
  auth,
  checkRole("admin", "super_admin"),
  userController.allUser,
);

export default router;
