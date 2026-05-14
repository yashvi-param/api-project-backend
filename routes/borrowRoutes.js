import express from "express";

import auth from "../middleware/auth.js";
import borrowController from "../controller/borrowController.js";

const router = express.Router();

router.post("/borrow-Book", auth, borrowController.borrowBook);

router.put("/return-Book", auth, borrowController.returnBook);

router.get("/history", auth, borrowController.borrowHistory);

export default router;
