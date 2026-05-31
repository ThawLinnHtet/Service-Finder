import { AppError } from "../../common/errors/app-error";
import {
  approveProviderById,
  findProviderForAdminDetail,
  findProvidersForAdminList,
  rejectProviderById,
} from "./repository";
import type { ListProvidersQuery } from "./validation";

export const listProvidersForAdmin = async (query: ListProvidersQuery) => {
  const limit = query.limit;

  const providers = await findProvidersForAdminList({
    status: query.status,
    cursor: query.cursor,
    limit: limit + 1,
  });

  const hasNextPage = providers.length > limit;
  const data = hasNextPage ? providers.slice(0, limit) : providers;
  const nextCursor = hasNextPage ? data[data.length - 1]?.id ?? null : null;

  return {
    data,
    meta: {
      nextCursor,
      hasNextPage,
    },
  };
};

export const getProviderForAdmin = async (providerId: string) => {
  const provider = await findProviderForAdminDetail(providerId);

  if (!provider) {
    throw new AppError("Provider not found", 404);
  }

  return provider;
};

export const approveProviderRegistration = async (providerId: string) => {
  const result = await approveProviderById(providerId);

  if (!result) {
    throw new AppError("Provider not found", 404);
  }

  return result;
};

export const rejectProviderRegistration = async (
  providerId: string,
  rejectionReason: string,
) => {
  const result = await rejectProviderById(providerId, rejectionReason);

  if (!result) {
    throw new AppError("Provider not found", 404);
  }

  return result;
};
