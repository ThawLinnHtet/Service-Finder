import {
  AppError,
  BadRequestError,
  ForbiddenError,
  ValidationError,
} from "../../common/errors/app-error";
import {
  countSkillsByCategory,
  hasCategory,
  hasNrcState,
  hasNrcTownshipInState,
} from "../../common/repositories/reference";
import { normalizeStringList } from "../../common/utils/lists";
import { validateAndNormalizeServiceAreas } from "../../common/utils/service-areas";
import { assertSkillSelection } from "../../common/utils/skills";
import { deleteImageByPublicId } from "../../common/utils/cloudinary";
import {
  assertProviderVerificationFilesAreSupported,
  assertProviderVerificationFilesExist,
  extractProviderVerificationFiles,
  uploadProviderVerificationImages,
} from "../../common/utils/provider-verification";
import { reverseGeocodeCoordinates } from "../locations/service";
import {
  findProviderProfileForResubmit,
  findProviderResubmitDataByUserId,
  resubmitProviderVerification,
} from "./repository";
import type { ResubmitProviderInput } from "./validation";

const normalizeNrcCode = (value: string): string => value.trim().toUpperCase();

const toNumber = (value: { toString(): string }): number => {
  const parsed = Number(value.toString());

  if (!Number.isFinite(parsed)) {
    throw new Error("Invalid numeric value in provider resubmit data");
  }

  return parsed;
};

export const getProviderResubmitData = async (providerUserId: string) => {
  const provider = await findProviderResubmitDataByUserId(providerUserId);

  if (!provider) {
    throw new AppError("Provider profile not found", 404);
  }

  if (provider.status === "APPROVED") {
    throw new ForbiddenError(
      "Resubmit data is only available for pending or rejected providers",
    );
  }

  const serviceProfile = provider.user.providedServices[0];

  if (!serviceProfile) {
    throw new AppError("Provider service profile is not configured", 409);
  }

  return {
    providerStatus: provider.status,
    rejectionReason: provider.rejectionReason,
    account: {
      username: provider.user.username,
      email: provider.user.email,
      phone: provider.user.phone,
    },
    form: {
      location: {
        city: provider.user.city,
        township: provider.user.township,
        latitude: toNumber(provider.user.latitude),
        longitude: toNumber(provider.user.longitude),
        address: provider.user.address,
      },
      about: provider.about,
      nrcStateCode: provider.nrcStateCode,
      nrcTownshipCode: provider.nrcTownshipCode,
      nrcType: provider.nrcType,
      nrcNumber: provider.nrcNumber,
      categoryId: serviceProfile.categoryId,
      title: serviceProfile.title,
      price: toNumber(serviceProfile.price),
      experienceYears: serviceProfile.experienceYears,
      predefinedSkillIds: serviceProfile.serviceSkills.map((entry) => entry.skillId),
      customSkills: serviceProfile.customSkills.map((entry) => entry.name),
      serviceAreas: serviceProfile.serviceAreas.map((entry) => entry.township),
    },
    documents: {
      nrcFront: {
        url: provider.documents?.nrcFrontUrl ?? null,
      },
      nrcBack: {
        url: provider.documents?.nrcBackUrl ?? null,
      },
      selfie: {
        url: provider.documents?.selfiePhotoUrl ?? null,
      },
    },
  };
};

export const resubmitProvider = async (
  providerUserId: string,
  input: ResubmitProviderInput,
  files: unknown,
) => {
  const provider = await findProviderProfileForResubmit(providerUserId);

  if (!provider) {
    throw new ForbiddenError("Only providers can resubmit verification");
  }

  if (provider.status !== "REJECTED") {
    throw new ForbiddenError("Only rejected providers can resubmit verification");
  }

  const uploadedFiles = assertProviderVerificationFilesExist(
    extractProviderVerificationFiles(files),
  );

  await assertProviderVerificationFilesAreSupported(uploadedFiles);

  const categoryExists = await hasCategory(input.categoryId);
  if (!categoryExists) {
    throw new BadRequestError("Selected category does not exist");
  }

  const normalizedNrcStateCode = normalizeNrcCode(input.nrcStateCode);
  const normalizedNrcTownshipCode = normalizeNrcCode(input.nrcTownshipCode);

  const stateExists = await hasNrcState(normalizedNrcStateCode);
  if (!stateExists) {
    throw new ValidationError([
      {
        field: "nrcStateCode",
        message: "Invalid NRC state code",
      },
    ]);
  }

  const townshipMatchesState = await hasNrcTownshipInState(
    normalizedNrcTownshipCode,
    normalizedNrcStateCode,
  );

  if (!townshipMatchesState) {
    throw new ValidationError([
      {
        field: "nrcTownshipCode",
        message: "NRC township code is invalid for the selected NRC state code",
      },
    ]);
  }

  const normalizedPredefinedSkillIds = normalizeStringList(input.predefinedSkillIds);
  const normalizedCustomSkills = normalizeStringList(input.customSkills);
  const normalizedServiceAreas = normalizeStringList(input.serviceAreas);

  assertSkillSelection(normalizedPredefinedSkillIds, normalizedCustomSkills);

  const matchedSkillCount = await countSkillsByCategory(
    normalizedPredefinedSkillIds,
    input.categoryId,
  );

  if (matchedSkillCount !== normalizedPredefinedSkillIds.length) {
    throw new BadRequestError(
      "Some predefined skills are invalid for the selected category",
    );
  }

  const resolvedLocation = await reverseGeocodeCoordinates(
    input.location.latitude,
    input.location.longitude,
  );

  const normalizedProviderServiceAreas = validateAndNormalizeServiceAreas(
    normalizedServiceAreas,
    resolvedLocation.city,
  );

  const uploadedImages = await uploadProviderVerificationImages(uploadedFiles);

  try {
    const result = await resubmitProviderVerification({
      input: {
        ...input,
        nrcStateCode: normalizedNrcStateCode,
        nrcTownshipCode: normalizedNrcTownshipCode,
        predefinedSkillIds: normalizedPredefinedSkillIds,
        customSkills: normalizedCustomSkills,
        serviceAreas: normalizedProviderServiceAreas,
      },
      userId: providerUserId,
      location: {
        city: resolvedLocation.city,
        township: resolvedLocation.township,
        address: input.location.address ?? resolvedLocation.address,
      },
      assets: {
        nrcFront: uploadedImages.nrcFront,
        nrcBack: uploadedImages.nrcBack,
        selfie: uploadedImages.selfie,
      },
    });

    if (!result) {
      throw new ForbiddenError("Only providers can resubmit verification");
    }

    const oldPublicIds = [
      result.oldDocuments?.nrcFrontPublicId,
      result.oldDocuments?.nrcBackPublicId,
      result.oldDocuments?.selfiePhotoPublicId,
    ].filter((value): value is string => typeof value === "string" && value.length > 0);

    await Promise.allSettled(oldPublicIds.map((publicId) => deleteImageByPublicId(publicId)));

    return {
      providerStatus: "PENDING" as const,
      message: "Provider resubmitted successfully. Waiting for admin approval",
    };
  } catch (error) {
    await Promise.allSettled([
      deleteImageByPublicId(uploadedImages.nrcFront.publicId),
      deleteImageByPublicId(uploadedImages.nrcBack.publicId),
      deleteImageByPublicId(uploadedImages.selfie.publicId),
    ]);

    throw error;
  }
};
