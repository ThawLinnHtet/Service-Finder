import multer from "multer";
import { BadRequestError } from "../errors/app-error";
import { isAllowedImageMimeType } from "../utils/file-signature";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  if (isAllowedImageMimeType(file.mimetype)) {
    callback(null, true);
    return;
  }

  callback(new BadRequestError("Only JPEG, PNG, and WebP image files are allowed"));
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
  },
  fileFilter,
});

export const providerVerificationUpload = upload.fields([
  { name: "nrcFrontImage", maxCount: 1 },
  { name: "nrcBackImage", maxCount: 1 },
  { name: "selfieImage", maxCount: 1 },
]);
