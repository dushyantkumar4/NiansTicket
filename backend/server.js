import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve("uploads")));
app.get("/api/health", (_req, res) => res.json({ message: "API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use((req, res) =>
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` }),
);
app.use((error, _req, res, _next) => {
  if (error.type === 'entity.parse.failed' || error.message === 'Multipart: Boundary not found') {
    return res.status(400).json({ message: 'Invalid request body. Send signup and login data as JSON.' });
  }
  if (error instanceof multer.MulterError)
    return res
      .status(400)
      .json({
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? "Attachment must be 5 MB or smaller"
            : error.message,
      });
  if (error.message === "Only PDF, JPG, JPEG, and PNG files are allowed")
    return res.status(400).json({ message: error.message });
  if (error.name === "ValidationError")
    return res.status(400).json({ message: error.message });
  if (error.code === 11000)
    return res
      .status(400)
      .json({ message: "A record with that value already exists" });
  if (error.message === 'JWT_SECRET is not configured') return res.status(500).json({ message: error.message });
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
});
const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT || 5001, () =>
      console.log(`Server running on port ${process.env.PORT || 5001}`),
    );
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};
startServer();
