import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  getAnalytics,
} from "../controllers/ticketController.js";
const router = express.Router();
router.post(
  "/",
  authMiddleware,
  roleMiddleware("customer"),
  uploadMiddleware,
  createTicket,
);
router.get("/", authMiddleware, getTickets);
router.get("/analytics", authMiddleware, roleMiddleware("admin"), getAnalytics);
router.get("/:id", authMiddleware, getTicketById);
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("admin"),
  updateTicketStatus,
);
export default router;
