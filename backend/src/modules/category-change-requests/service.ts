import { AppError, ForbiddenError, ValidationError } from "../../common/errors/app-error";
import { countSkillsByCategory, hasCategory } from "../../common/repositories/reference";
import { normalizeStringList } from "../../common/utils/lists";
import { assertSkillSelection } from "../../common/utils/skills";
import {
  approveCategoryChangeRequestById,
  createCategoryChangeRequest,
  findCategoryChangeRequestById,
  findCategoryChangeRequestsForAdminList,
  findFirstServiceCategoryByProviderUserId,
  findProviderForCategoryChangeRequestByUserId,
  hasPendingCategoryChangeRequest,
  rejectCategoryChangeRequestById,
} from "./repository";
import type {
  CreateCategoryChangeRequestInput,
  ListCategoryChangeRequestsQuery,
} from "./validation";

export const submitCategoryChangeRequest = async (
  providerUserId: string,
  input: CreateCategoryChangeRequestInput,
) => {
  const provider = await findProviderForCategoryChangeRequestByUserId(providerUserId);

  if (!provider) {
    throw new ForbiddenError("Only providers can request category change");
  }

  if (provider.status !== "APPROVED") {
    throw new ForbiddenError("Only approved providers can request category change");
  }

  const primaryCategoryId =
    provider.primaryCategoryId ??
    (await findFirstServiceCategoryByProviderUserId(providerUserId))?.categoryId ??
    null;

  if (!primaryCategoryId) {
    throw new AppError("Provider primary category is not configured", 409);
  }

  if (primaryCategoryId === input.requestedCategoryId) {
    throw new ValidationError([
      {
        field: "requestedCategoryId",
        message: "Requested category must be different from current category",
      },
    ]);
  }

  const pendingExists = await hasPendingCategoryChangeRequest(provider.id);

  if (pendingExists) {
    throw new ValidationError([
      {
        field: "status",
        message: "You already have a pending category change request",
      },
    ]);
  }

  const categoryExists = await hasCategory(input.requestedCategoryId);

  if (!categoryExists) {
    throw new ValidationError([
      {
        field: "requestedCategoryId",
        message: "Requested category does not exist",
      },
    ]);
  }

  const normalizedPredefinedSkillIds = normalizeStringList(input.predefinedSkillIds);
  const normalizedCustomSkills = normalizeStringList(input.customSkills);

  assertSkillSelection(normalizedPredefinedSkillIds, normalizedCustomSkills);

  const matchedSkillCount = await countSkillsByCategory(
    normalizedPredefinedSkillIds,
    input.requestedCategoryId,
  );

  if (matchedSkillCount !== normalizedPredefinedSkillIds.length) {
    throw new ValidationError([
      {
        field: "predefinedSkillIds",
        message: "Some predefined skills are invalid for the requested category",
      },
    ]);
  }

  return createCategoryChangeRequest({
    providerId: provider.id,
    currentCategoryId: primaryCategoryId,
    requestedCategoryId: input.requestedCategoryId,
    title: input.title,
    reason: input.reason,
    price: input.price,
    experienceYears: input.experienceYears,
    predefinedSkillIds: normalizedPredefinedSkillIds,
    customSkills: normalizedCustomSkills,
  });
};

export const listCategoryChangeRequestsForAdmin = async (
  query: ListCategoryChangeRequestsQuery,
) => {
  const requests = await findCategoryChangeRequestsForAdminList({
    status: query.status,
    cursor: query.cursor,
    limit: query.limit + 1,
  });

  const hasNextPage = requests.length > query.limit;
  const data = hasNextPage ? requests.slice(0, query.limit) : requests;
  const nextCursor = hasNextPage ? data[data.length - 1]?.id ?? null : null;

  return {
    data,
    meta: {
      nextCursor,
      hasNextPage,
    },
  };
};

export const getCategoryChangeRequestForAdmin = async (requestId: string) => {
  const request = await findCategoryChangeRequestById(requestId);

  if (!request) {
    throw new AppError("Category change request not found", 404);
  }

  return request;
};

export const approveCategoryChangeRequest = async (requestId: string) => {
  const request = await findCategoryChangeRequestById(requestId);

  if (!request) {
    throw new AppError("Category change request not found", 404);
  }

  if (request.status !== "PENDING") {
    throw new AppError("Category change request is not pending", 409);
  }

  const matchedSkillCount = await countSkillsByCategory(
    request.predefinedSkillIds,
    request.requestedCategory.id,
  );

  if (matchedSkillCount !== request.predefinedSkillIds.length) {
    throw new ValidationError([
      {
        field: "predefinedSkillIds",
        message: "Request contains invalid predefined skills for requested category",
      },
    ]);
  }

  const result = await approveCategoryChangeRequestById(requestId);

  if (!result) {
    throw new AppError("Category change request is not pending", 409);
  }

  return result;
};

export const rejectCategoryChangeRequest = async (
  requestId: string,
  rejectionReason: string,
) => {
  const request = await findCategoryChangeRequestById(requestId);

  if (!request) {
    throw new AppError("Category change request not found", 404);
  }

  if (request.status !== "PENDING") {
    throw new AppError("Category change request is not pending", 409);
  }

  const result = await rejectCategoryChangeRequestById(requestId, rejectionReason);

  if (result.count === 0) {
    throw new AppError("Category change request is not pending", 409);
  }

  return {
    requestId,
    status: "REJECTED" as const,
  };
};
