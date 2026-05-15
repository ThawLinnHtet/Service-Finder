import { fileTypeFromBuffer } from "file-type";

const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const isAllowedImageMimeType = (mimeType: string): boolean => {
  return ALLOWED_IMAGE_MIME_TYPES.includes(
    mimeType as (typeof ALLOWED_IMAGE_MIME_TYPES)[number],
  );
};

export const isAllowedImageBuffer = async (buffer: Buffer): Promise<boolean> => {
  const detected = await fileTypeFromBuffer(buffer);

  if (!detected) {
    return false;
  }

  return isAllowedImageMimeType(detected.mime);
};
