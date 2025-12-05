import multer from "multer";
import multerS3 from "multer-s3";
import { Request, Response, NextFunction } from "express";
import { getS3Client, getBucketName } from "../utils/s3Util";

// Allowed image MIME types
const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

// File size limit: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// File filter function
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Only ${allowedMimeTypes.join(", ")} are allowed.`
      )
    );
  }
};

// Configure multer-s3 storage
const s3Client = getS3Client();
const uploadImg = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: getBucketName(),
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const uniqueFileName = `uploads/${Date.now()}-${file.originalname}`;
      cb(null, uniqueFileName);
    },
  }),
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// Wrapper middleware to handle multer errors
export const upload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  uploadImg.single("image")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "File too large. Maximum size is 5MB.",
          });
        }
        return res.status(400).json({
          message: "Upload error",
          error: err.message,
        });
      }
      return res.status(400).json({
        message: err.message || "File upload failed",
      });
    }
    next();
  });
};
