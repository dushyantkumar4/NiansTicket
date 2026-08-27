import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  signup,
  login,
  getMe,
  adminTest,
} from "../controllers/authController.js";
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.get("/admin-test", authMiddleware, roleMiddleware("admin"), adminTest);
export default router;
