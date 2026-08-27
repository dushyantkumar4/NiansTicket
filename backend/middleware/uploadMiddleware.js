import fs from "fs";
import path from "path";
import multer from "multer";
const uploadDirectory = path.resolve("uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });
const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDirectory),
    filename: (_req, file, cb) =>
      cb(
        null,
        `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`,
      ),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) =>
    cb(
      ["application/pdf", "image/jpeg", "image/png"].includes(file.mimetype)
        ? null
        : new Error("Only PDF, JPG, JPEG, and PNG files are allowed"),
      ["application/pdf", "image/jpeg", "image/png"].includes(file.mimetype),
    ),
}).single("attachment");
export default uploadMiddleware;
