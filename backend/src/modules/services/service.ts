import {
  AppError,
  BadRequestError,
  ForbiddenError,
  ValidationError,
} from "../../common/errors/app-error";
import { z } from "zod";
import { MAX_ACTIVE_SERVICES_PER_PROVIDER } from "../../common/constants/services";
import { normalizeAreaName } from "../../common/constants/service-areas";
import { countSkillsByCategory, hasCategory } from "../../common/repositories/reference";
import { normalizeStringList } from "../../common/utils/lists";
import { validateAndNormalizeServiceAreas } from "../../common/utils/service-areas";
import { assertSkillSelection } from "../../common/utils/skills";
import {
  activateProviderService,
  createProviderServiceWithRelations,
  deactivateProviderService,
  findProviderProfileForServicesByUserId,
  findProviderServiceById,
  findProviderServices,
  findPublicServicesByIds,
  getProviderServiceConstraints,
  searchPublicServiceIds,
  updateProviderServiceWithRelations,
  type PublicServiceSearchCursor,
  type PublicServiceSearchRow,
} from "./repository";
import type {
  CreateProviderServiceInput,
  ListProviderServicesQuery,
  ListPublicServicesQuery,
  UpdateProviderServiceInput,
} from "./validation";

type ServiceRecord = NonNullable<
  Awaited<ReturnType<typeof findProviderServiceById>>
>;

type PublicServiceRecord = Awaited<ReturnType<typeof findPublicServicesByIds>>[number];

const publicSearchCursorSchema = z.discriminatedUnion("sort", [
  z
    .object({
      sort: z.literal("recent"),
      id: z.string().uuid(),
      createdAt: z.string().datetime(),
    })
    .strict(),
  z
    .object({
      sort: z.literal("provider_recent"),
      id: z.string().uuid(),
      providerCreatedAt: z.string().datetime(),
    })
    .strict(),
  z
    .object({
      sort: z.literal("price_asc"),
      id: z.string().uuid(),
      price: z.number().min(0),
    })
    .strict(),
  z
    .object({
      sort: z.literal("price_desc"),
      id: z.string().uuid(),
      price: z.number().min(0),
    })
    .strict(),
  z
    .object({
      sort: z.literal("nearest"),
      id: z.string().uuid(),
      distanceKm: z.number().min(0),
    })
    .strict(),
]);

const toServiceResponse = (service: ServiceRecord) => {
  return {
    id: service.id,
    providerId: service.providerId,
    categoryId: service.categoryId,
    title: service.title,
    description: service.description,
    price: service.price.toString(),
    experienceYears: service.experienceYears,
    isActive: service.isActive,
    isVisible: service.isVisible,
    isAvailable: service.isAvailable,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
    category: service.category,
    predefinedSkills: service.serviceSkills.map((entry) => entry.skill),
    customSkills: service.customSkills,
    serviceAreas: service.serviceAreas,
  };
};

const decodePublicSearchCursor = (
  cursor: string | undefined,
  sort: ListPublicServicesQuery["sort"],
): PublicServiceSearchCursor | undefined => {
  if (!cursor) {
    return undefined;
  }

  let decoded: unknown;

  try {
    decoded = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as unknown;
  } catch {
    throw new ValidationError([
      {
        field: "cursor",
        message: "Invalid cursor",
      },
    ]);
  }

  const parsedCursor = publicSearchCursorSchema.safeParse(decoded);

  if (!parsedCursor.success || parsedCursor.data.sort !== sort) {
    throw new ValidationError([
      {
        field: "cursor",
        message: "Invalid cursor for selected sort",
      },
    ]);
  }

  const parsed = parsedCursor.data;

  if (parsed.sort === "recent") {
    return { sort: parsed.sort, id: parsed.id, createdAt: new Date(parsed.createdAt) };
  }

  if (parsed.sort === "provider_recent") {
    return {
      sort: parsed.sort,
      id: parsed.id,
      providerCreatedAt: new Date(parsed.providerCreatedAt),
    };
  }

  if (parsed.sort === "price_asc" || parsed.sort === "price_desc") {
    return { sort: parsed.sort, id: parsed.id, price: parsed.price };
  }

  return { sort: parsed.sort, id: parsed.id, distanceKm: parsed.distanceKm };
};

const encodePublicSearchCursor = (
  row: PublicServiceSearchRow,
  sort: ListPublicServicesQuery["sort"],
): string => {
  const base = {
    sort,
    id: row.serviceId,
  };

  if (sort === "recent") {
    return Buffer.from(
      JSON.stringify({ ...base, createdAt: row.createdAt.toISOString() }),
    ).toString("base64url");
  }

  if (sort === "provider_recent") {
    return Buffer.from(
      JSON.stringify({
        ...base,
        providerCreatedAt: row.providerCreatedAt.toISOString(),
      }),
    ).toString("base64url");
  }

  if (sort === "price_asc" || sort === "price_desc") {
    return Buffer.from(
      JSON.stringify({ ...base, price: Number(row.price) }),
    ).toString("base64url");
  }

  return Buffer.from(
    JSON.stringify({ ...base, distanceKm: row.distanceKm ?? 0 }),
  ).toString("base64url");
};

const roundDistanceKm = (distanceKm: number | null | undefined): number | null => {
  if (distanceKm === null || distanceKm === undefined) {
    return null;
  }

  return Math.round(distanceKm * 100) / 100;
};

const toPublicServiceCard = (
  service: PublicServiceRecord,
  distanceKm: number | null | undefined,
) => {
  return {
    id: service.id,
    providerId: service.providerId,
    categoryId: service.categoryId,
    title: service.title,
    description: service.description,
    price: service.price.toString(),
    experienceYears: service.experienceYears,
    isAvailable: service.isAvailable,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
    category: service.category,
    predefinedSkills: service.serviceSkills.map((entry) => entry.skill),
    customSkills: service.customSkills,
    serviceAreas: service.serviceAreas,
    provider: {
      id: service.provider.id,
      username: service.provider.username,
      city: service.provider.city,
      township: service.provider.township,
      address: service.provider.address,
      latitude: service.provider.latitude.toString(),
      longitude: service.provider.longitude.toString(),
      ratingAverage: service.provider.providerProfile?.ratingAverage.toString() ?? "0",
      ratingCount: service.provider.providerProfile?.ratingCount ?? 0,
    },
    distanceKm: roundDistanceKm(distanceKm),
  };
};

const getProviderContextOrThrow = async (userId: string) => {
  const provider = await findProviderProfileForServicesByUserId(userId);

  if (!provider) {
    throw new ForbiddenError("Only providers can manage services");
  }

  return provider;
};

const assertProviderApproved = (status: "PENDING" | "APPROVED" | "REJECTED"): void => {
  if (status === "APPROVED") {
    return;
  }

  if (status === "PENDING") {
    throw new ForbiddenError("Provider account is waiting for admin approval");
  }

  throw new ForbiddenError("Provider account was rejected. Please resubmit for review");
};

const assertCategoryExists = async (categoryId: string): Promise<void> => {
  const categoryExists = await hasCategory(categoryId);

  if (!categoryExists) {
    throw new BadRequestError("Selected category does not exist");
  }
};

const assertPredefinedSkillsMatchCategory = async (
  predefinedSkillIds: string[],
  categoryId: string,
): Promise<void> => {
  const matchedSkillCount = await countSkillsByCategory(predefinedSkillIds, categoryId);

  if (matchedSkillCount !== predefinedSkillIds.length) {
    throw new BadRequestError(
      "Some predefined skills are invalid for the selected category",
    );
  }
};

const getOwnedServiceOrThrow = async (serviceId: string, providerUserId: string) => {
  const service = await findProviderServiceById(serviceId, providerUserId);

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  return service;
};

export const listOwnServices = async (
  providerUserId: string,
  query: ListProviderServicesQuery,
) => {
  const provider = await getProviderContextOrThrow(providerUserId);
  assertProviderApproved(provider.status);

  const services = await findProviderServices(
    providerUserId,
    query.cursor,
    query.limit + 1,
  );

  const hasNextPage = services.length > query.limit;
  const data = hasNextPage ? services.slice(0, query.limit) : services;
  const nextCursor = hasNextPage ? data[data.length - 1]?.id ?? null : null;

  return {
    data: data.map((service) => toServiceResponse(service)),
    meta: {
      nextCursor,
      hasNextPage,
    },
  };
};

export const listPublicServices = async (query: ListPublicServicesQuery) => {
  const cursor = decodePublicSearchCursor(query.cursor, query.sort);
  const rows = await searchPublicServiceIds({
    search: query.search,
    categoryId: query.categoryId,
    skillIds: normalizeStringList(query.skillIds),
    township: query.township ? normalizeAreaName(query.township) : undefined,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
    minRating: query.minRating,
    isAvailable: query.isAvailable,
    noCompletedServices: query.noCompletedServices,
    latitude: query.latitude,
    longitude: query.longitude,
    sort: query.sort,
    cursor,
    take: query.limit + 1,
  });

  const rawHasNextPage = rows.length > query.limit;
  const pageRows = rawHasNextPage ? rows.slice(0, query.limit) : rows;
  const distanceByServiceId = new Map(
    pageRows.map((row) => [row.serviceId, row.distanceKm] as const),
  );
  const services = await findPublicServicesByIds(pageRows.map((row) => row.serviceId));
  const serviceById = new Map(services.map((service) => [service.id, service] as const));
  const returnedItems = pageRows
    .map((row) => {
      const service = serviceById.get(row.serviceId);
      return service ? { row, service } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
  const data = returnedItems.map(({ row, service }) =>
    toPublicServiceCard(service, distanceByServiceId.get(row.serviceId)),
  );
  const lastReturnedRow = returnedItems[returnedItems.length - 1]?.row;
  const hasNextPage = rawHasNextPage && lastReturnedRow !== undefined;

  return {
    data,
    meta: {
      nextCursor: hasNextPage ? encodePublicSearchCursor(lastReturnedRow, query.sort) : null,
      hasNextPage,
    },
  };
};

export const getOwnServiceById = async (providerUserId: string, serviceId: string) => {
  const provider = await getProviderContextOrThrow(providerUserId);
  assertProviderApproved(provider.status);
  const service = await getOwnedServiceOrThrow(serviceId, providerUserId);
  return toServiceResponse(service);
};

export const createService = async (
  providerUserId: string,
  input: CreateProviderServiceInput,
) => {
  const provider = await getProviderContextOrThrow(providerUserId);
  assertProviderApproved(provider.status);

  const constraints = await getProviderServiceConstraints(provider.userId);

  if (constraints.totalServiceCount > 0) {
    throw new ValidationError([
      {
        field: "services",
        message: "Provider already has a service profile. Please update existing service",
      },
    ]);
  }

  const providerPrimaryCategoryId =
    provider.primaryCategoryId ?? constraints.primaryCategoryId;

  if (
    providerPrimaryCategoryId &&
    providerPrimaryCategoryId !== input.categoryId
  ) {
    throw new ValidationError([
      {
        field: "categoryId",
        message: "Service category must match provider primary category",
      },
    ]);
  }

  if (constraints.activeServiceCount >= MAX_ACTIVE_SERVICES_PER_PROVIDER) {
    throw new ValidationError([
      {
        field: "services",
        message: `Maximum ${MAX_ACTIVE_SERVICES_PER_PROVIDER} active services allowed`,
      },
    ]);
  }

  const normalizedPredefinedSkillIds = normalizeStringList(input.predefinedSkillIds);
  const normalizedCustomSkills = normalizeStringList(input.customSkills);
  const normalizedServiceAreas = normalizeStringList(input.serviceAreas);

  assertSkillSelection(normalizedPredefinedSkillIds, normalizedCustomSkills);

  await assertCategoryExists(input.categoryId);
  await assertPredefinedSkillsMatchCategory(normalizedPredefinedSkillIds, input.categoryId);

  const validatedServiceAreas = validateAndNormalizeServiceAreas(
    normalizedServiceAreas,
    provider.city,
  );

  const isVisible = provider.status === "APPROVED";

  const service = await createProviderServiceWithRelations({
    providerId: provider.userId,
    categoryId: input.categoryId,
    title: input.title,
    description: input.description,
    price: input.price,
    experienceYears: input.experienceYears,
    isAvailable: input.isAvailable ?? true,
    isVisible,
    predefinedSkillIds: normalizedPredefinedSkillIds,
    customSkills: normalizedCustomSkills,
    serviceAreas: validatedServiceAreas,
    city: provider.city,
  });

  return toServiceResponse(service);
};

export const updateService = async (
  providerUserId: string,
  serviceId: string,
  input: UpdateProviderServiceInput,
) => {
  const provider = await getProviderContextOrThrow(providerUserId);
  assertProviderApproved(provider.status);
  const existingService = await getOwnedServiceOrThrow(serviceId, providerUserId);

  const hasSkillPatch =
    input.predefinedSkillIds !== undefined || input.customSkills !== undefined;

  if (input.categoryId && !hasSkillPatch) {
    throw new ValidationError([
      {
        field: "predefinedSkillIds",
        message: "Update service skills when changing category",
      },
    ]);
  }

  const normalizedPredefinedSkillIds = hasSkillPatch
    ? normalizeStringList(input.predefinedSkillIds ?? [])
    : undefined;
  const normalizedCustomSkills = hasSkillPatch
    ? normalizeStringList(input.customSkills ?? [])
    : undefined;

  if (normalizedPredefinedSkillIds && normalizedCustomSkills) {
    assertSkillSelection(normalizedPredefinedSkillIds, normalizedCustomSkills);
  }

  const nextCategoryId = input.categoryId ?? existingService.categoryId;

  if (input.categoryId) {
    const constraints = await getProviderServiceConstraints(provider.userId);
    const providerPrimaryCategoryId =
      provider.primaryCategoryId ?? constraints.primaryCategoryId;

    if (
      providerPrimaryCategoryId &&
      input.categoryId !== providerPrimaryCategoryId
    ) {
      throw new ValidationError([
        {
          field: "categoryId",
          message: "Service category must match provider primary category",
        },
      ]);
    }
  }

  if (input.categoryId) {
    await assertCategoryExists(input.categoryId);
  }

  if (normalizedPredefinedSkillIds) {
    await assertPredefinedSkillsMatchCategory(normalizedPredefinedSkillIds, nextCategoryId);
  }

  const normalizedServiceAreas = input.serviceAreas
    ? validateAndNormalizeServiceAreas(
        normalizeStringList(input.serviceAreas),
        provider.city,
      )
    : undefined;

  const service = await updateProviderServiceWithRelations({
    serviceId,
    city: provider.city,
    data: {
      categoryId: input.categoryId,
      title: input.title,
      description: input.description,
      price: input.price,
      experienceYears: input.experienceYears,
      isAvailable: input.isAvailable,
      isVisible: provider.status === "APPROVED" ? existingService.isVisible : false,
    },
    predefinedSkillIds: normalizedPredefinedSkillIds,
    customSkills: normalizedCustomSkills,
    serviceAreas: normalizedServiceAreas,
  });

  return toServiceResponse(service);
};

export const activateService = async (providerUserId: string, serviceId: string) => {
  const provider = await getProviderContextOrThrow(providerUserId);
  assertProviderApproved(provider.status);
  await getOwnedServiceOrThrow(serviceId, providerUserId);

  const service = await activateProviderService(
    serviceId,
    provider.status === "APPROVED",
  );

  return toServiceResponse(service);
};

export const deactivateService = async (providerUserId: string, serviceId: string) => {
  const provider = await getProviderContextOrThrow(providerUserId);
  assertProviderApproved(provider.status);
  await getOwnedServiceOrThrow(serviceId, providerUserId);

  const service = await deactivateProviderService(serviceId);
  return toServiceResponse(service);
};
