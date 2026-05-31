import { BadRequestError, ValidationError, type ValidationIssue } from "../errors/app-error";
import { deleteImageByPublicId, uploadImageBuffer } from "./cloudinary";
import { isAllowedImageBuffer } from "./file-signature";

export type ProviderVerificationFiles = {
  nrcFrontImage: Express.Multer.File;
  nrcBackImage: Express.Multer.File;
  selfieImage: Express.Multer.File;
};

export type UploadedVerificationImages = {
  nrcFront: {
    url: string;
    publicId: string;
  };
  nrcBack: {
    url: string;
    publicId: string;
  };
  selfie: {
    url: string;
    publicId: string;
  };
};

export const extractProviderVerificationFiles = (
  files: unknown,
): ProviderVerificationFiles | null => {
  if (!files || typeof files !== "object") {
    return null;
  }

  const parsed = files as Record<string, Express.Multer.File[] | undefined>;

  const nrcFrontImage = parsed.nrcFrontImage?.[0];
  const nrcBackImage = parsed.nrcBackImage?.[0];
  const selfieImage = parsed.selfieImage?.[0];

  if (!nrcFrontImage || !nrcBackImage || !selfieImage) {
    return null;
  }

  return {
    nrcFrontImage,
    nrcBackImage,
    selfieImage,
  };
};

export const assertProviderVerificationFilesExist = (
  files: ProviderVerificationFiles | null,
): ProviderVerificationFiles => {
  if (!files) {
    throw new BadRequestError(
      "NRC front image, NRC back image, and selfie image are required",
    );
  }

  return files;
};

export const assertProviderVerificationFilesAreSupported = async (
  files: ProviderVerificationFiles,
): Promise<void> => {
  const invalidFileIssues: ValidationIssue[] = [];

  const isNrcFrontValid = await isAllowedImageBuffer(files.nrcFrontImage.buffer);
  if (!isNrcFrontValid) {
    invalidFileIssues.push({
      field: "nrcFrontImage",
      message: "NRC front image must be a JPEG, PNG, or WebP file",
    });
  }

  const isNrcBackValid = await isAllowedImageBuffer(files.nrcBackImage.buffer);
  if (!isNrcBackValid) {
    invalidFileIssues.push({
      field: "nrcBackImage",
      message: "NRC back image must be a JPEG, PNG, or WebP file",
    });
  }

  const isSelfieValid = await isAllowedImageBuffer(files.selfieImage.buffer);
  if (!isSelfieValid) {
    invalidFileIssues.push({
      field: "selfieImage",
      message: "Selfie image must be a JPEG, PNG, or WebP file",
    });
  }

  if (invalidFileIssues.length > 0) {
    throw new ValidationError(invalidFileIssues);
  }
};

export const uploadProviderVerificationImages = async (
  files: ProviderVerificationFiles,
): Promise<UploadedVerificationImages> => {
  const uploadedPublicIds: string[] = [];

  try {
    const nrcFront = await uploadImageBuffer(
      files.nrcFrontImage.buffer,
      "service-finder/providers",
    );
    uploadedPublicIds.push(nrcFront.publicId);

    const nrcBack = await uploadImageBuffer(
      files.nrcBackImage.buffer,
      "service-finder/providers",
    );
    uploadedPublicIds.push(nrcBack.publicId);

    const selfie = await uploadImageBuffer(
      files.selfieImage.buffer,
      "service-finder/providers",
    );
    uploadedPublicIds.push(selfie.publicId);

    return { nrcFront, nrcBack, selfie };
  } catch (error) {
    await Promise.allSettled(
      uploadedPublicIds.map((publicId) => deleteImageByPublicId(publicId)),
    );
    throw error;
  }
};
