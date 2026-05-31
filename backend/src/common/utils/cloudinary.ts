import { cloudinary } from "../../config/cloudinary";
import { AppError } from "../errors/app-error";

type UploadedAsset = {
  url: string;
  publicId: string;
};

type CloudinaryErrorPayload = {
  message?: unknown;
  name?: unknown;
  http_code?: unknown;
};

export const uploadImageBuffer = (
  buffer: Buffer,
  folder: string,
): Promise<UploadedAsset> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(toCloudinaryUploadError(error));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    stream.end(buffer);
  });
};

export const deleteImageByPublicId = async (publicId: string): Promise<void> => {
  if (!publicId.trim()) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch {
    return;
  }
};

const toCloudinaryUploadError = (error: unknown): AppError => {
  const defaultMessage = "Image upload failed. Please try again";

  if (error instanceof Error) {
    return new AppError(error.message, 502);
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return new AppError(error, 502);
  }

  if (error && typeof error === "object") {
    const payload = error as CloudinaryErrorPayload;
    const httpCode =
      typeof payload.http_code === "number" ? payload.http_code : undefined;

    if (httpCode === 503) {
      return new AppError(
        "Image upload service is temporarily unavailable. Please try again shortly",
        503,
        {
          name: typeof payload.name === "string" ? payload.name : undefined,
          httpCode,
        },
      );
    }

    const statusCode =
      typeof httpCode === "number" && httpCode >= 400 && httpCode < 600
        ? httpCode
        : 502;

    const message =
      statusCode >= 500
        ? defaultMessage
        : typeof payload.message === "string" && payload.message.trim().length > 0
          ? payload.message
          : defaultMessage;

    const details = {
      name: typeof payload.name === "string" ? payload.name : undefined,
      httpCode,
    };

    return new AppError(message, statusCode, details);
  }

  return new AppError(defaultMessage, 502);
};
