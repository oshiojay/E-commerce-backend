import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const uploadDir = path.join(process.cwd(), "assets");

// create the folder if it doesn't exist, otherwise multer errors on the first upload
fs.mkdirSync(uploadDir, { recursive: true });

export const upload = multer({
  storage: multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) => {
      cb(null, uploadDir);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
      const extension = path.extname(file.originalname).toLowerCase(); // includes the dot
      cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Invalid Image Format"));
      return;
    }
    cb(null, true);
  },
});