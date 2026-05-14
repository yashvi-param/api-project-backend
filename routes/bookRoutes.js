import express from "express";

import auth from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";
import bookController from "../controller/bookController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/getBook", auth, bookController.getBook);
router.post(
  "/createBook",
  upload.single("bookPic"),
  auth,
  checkRole("admin", "super_admin"),
  bookController.createBook,
);
router.patch(
  "/update-book/:id",
  auth,
  checkRole("admin", "super_admin"),
  bookController.updateBook,
);
router.delete(
  "/delete-book/:id",
  auth,
  checkRole("admin", "super_admin"),
  bookController.getBook,
);

export default router;
