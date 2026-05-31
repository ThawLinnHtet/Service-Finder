import { prisma } from "../../database/prisma";
import { Prisma } from "../../generated/prisma/client";
import type { PublicServiceSort } from "./validation";

type ProviderStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ProviderProfileForServices = {
  id: string;
  userId: string;
  status: ProviderStatus;
  city: string;
  primaryCategoryId: string | null;
};

type CreateServiceInput = {
  providerId: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  experienceYears: number;
  isAvailable: boolean;
  isVisible: boolean;
  serviceAreas: string[];
  predefinedSkillIds: string[];
  customSkills: string[];
  city: string;
};

type UpdateServiceInput = {
  serviceId: string;
  data: {
    categoryId?: string;
    title?: string;
    description?: string;
    price?: number;
    experienceYears?: number;
    isAvailable?: boolean;
    isVisible?: boolean;
  };
  serviceAreas?: string[];
  predefinedSkillIds?: string[];
  customSkills?: string[];
  city: string;
};

export type PublicServiceSearchFilters = {
  search?: string;
  categoryId?: string;
  skillIds: string[];
  township?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  isAvailable?: boolean;
  noCompletedServices?: boolean;
  latitude?: number;
  longitude?: number;
  sort: PublicServiceSort;
  cursor?: PublicServiceSearchCursor;
  take: number;
};

export type PublicServiceSearchCursor =
  | { sort: "recent"; id: string; createdAt: Date }
  | { sort: "provider_recent"; id: string; providerCreatedAt: Date }
  | { sort: "price_asc" | "price_desc"; id: string; price: number }
  | { sort: "nearest"; id: string; distanceKm: number };

export type PublicServiceSearchRow = {
  serviceId: string;
  createdAt: Date;
  providerCreatedAt: Date;
  price: string;
  distanceKm: number | null;
};

const providerServiceSelect = {
  id: true,
  providerId: true,
  categoryId: true,
  title: true,
  description: true,
  price: true,
  experienceYears: true,
  isActive: true,
  isVisible: true,
  isAvailable: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
  serviceSkills: {
    select: {
      skill: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  customSkills: {
    select: {
      id: true,
      name: true,
    },
  },
  serviceAreas: {
    select: {
      city: true,
      township: true,
    },
  },
} as const;

const publicServiceSelect = {
  id: true,
  providerId: true,
  categoryId: true,
  title: true,
  description: true,
  price: true,
  experienceYears: true,
  isActive: true,
  isVisible: true,
  isAvailable: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
  serviceSkills: {
    select: {
      skill: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  customSkills: {
    select: {
      id: true,
      name: true,
    },
  },
  serviceAreas: {
    select: {
      city: true,
      township: true,
    },
  },
  provider: {
    select: {
      id: true,
      username: true,
      city: true,
      township: true,
      address: true,
      latitude: true,
      longitude: true,
      createdAt: true,
      providerProfile: {
        select: {
          status: true,
          ratingAverage: true,
          ratingCount: true,
        },
      },
    },
  },
} as const;

const buildDistanceExpression = (latitude?: number, longitude?: number): Prisma.Sql => {
  if (latitude === undefined || longitude === undefined) {
    return Prisma.sql`NULL::double precision`;
  }

  return Prisma.sql`(
    6371 * 2 * asin(
      sqrt(
        power(sin(radians((p."latitude"::double precision - ${latitude}) / 2)), 2) +
        cos(radians(${latitude})) * cos(radians(p."latitude"::double precision)) *
        power(sin(radians((p."longitude"::double precision - ${longitude}) / 2)), 2)
      )
    )
  )`;
};

const buildPublicSearchCursorSql = (
  sort: PublicServiceSort,
  cursor: PublicServiceSearchCursor | undefined,
  distanceExpression: Prisma.Sql,
): Prisma.Sql => {
  if (!cursor || cursor.sort !== sort) {
    return Prisma.empty;
  }

  if (sort === "recent" && cursor.sort === "recent") {
    return Prisma.sql`AND (s."createdAt" < ${cursor.createdAt} OR (s."createdAt" = ${cursor.createdAt} AND s.id > ${cursor.id}))`;
  }

  if (sort === "provider_recent" && cursor.sort === "provider_recent") {
    return Prisma.sql`AND (p."createdAt" < ${cursor.providerCreatedAt} OR (p."createdAt" = ${cursor.providerCreatedAt} AND s.id > ${cursor.id}))`;
  }

  if (sort === "price_asc" && cursor.sort === "price_asc") {
    return Prisma.sql`AND (s.price > ${cursor.price} OR (s.price = ${cursor.price} AND s.id > ${cursor.id}))`;
  }

  if (sort === "price_desc" && cursor.sort === "price_desc") {
    return Prisma.sql`AND (s.price < ${cursor.price} OR (s.price = ${cursor.price} AND s.id > ${cursor.id}))`;
  }

  if (sort === "nearest" && cursor.sort === "nearest") {
    return Prisma.sql`AND (${distanceExpression} > ${cursor.distanceKm} OR (abs(${distanceExpression} - ${cursor.distanceKm}) < 0.000001 AND s.id > ${cursor.id}))`;
  }

  return Prisma.empty;
};

const buildPublicSearchOrderSql = (
  sort: PublicServiceSort,
  distanceExpression: Prisma.Sql,
): Prisma.Sql => {
  if (sort === "price_asc") {
    return Prisma.sql`s.price ASC, s.id ASC`;
  }

  if (sort === "price_desc") {
    return Prisma.sql`s.price DESC, s.id ASC`;
  }

  if (sort === "provider_recent") {
    return Prisma.sql`p."createdAt" DESC, s.id ASC`;
  }

  if (sort === "nearest") {
    return Prisma.sql`${distanceExpression} ASC, s.id ASC`;
  }

  return Prisma.sql`s."createdAt" DESC, s.id ASC`;
};

export const findProviderProfileForServicesByUserId = async (
  userId: string,
): Promise<ProviderProfileForServices | null> => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      userId: true,
      status: true,
      primaryCategoryId: true,
      user: {
        select: {
          city: true,
        },
      },
    },
  });

  if (!provider) {
    return null;
  }

  return {
    id: provider.id,
    userId: provider.userId,
    status: provider.status,
    city: provider.user.city,
    primaryCategoryId: provider.primaryCategoryId,
  };
};

export const getProviderServiceConstraints = async (providerId: string) => {
  const [activeServiceCount, totalServiceCount, primaryService] = await prisma.$transaction([
    prisma.service.count({
      where: {
        providerId,
        isActive: true,
      },
    }),
    prisma.service.count({
      where: {
        providerId,
      },
    }),
    prisma.service.findFirst({
      where: { providerId },
      orderBy: [{ createdAt: "asc" }],
      select: {
        categoryId: true,
      },
    }),
  ]);

  return {
    activeServiceCount,
    totalServiceCount,
    primaryCategoryId: primaryService?.categoryId ?? null,
  };
};

export const createProviderServiceWithRelations = (input: CreateServiceInput) => {
  return prisma.$transaction(async (tx) => {
    const service = await tx.service.create({
      data: {
        providerId: input.providerId,
        categoryId: input.categoryId,
        title: input.title,
        description: input.description,
        price: input.price,
        experienceYears: input.experienceYears,
        isActive: true,
        isVisible: input.isVisible,
        isAvailable: input.isAvailable,
      },
      select: { id: true },
    });

    if (input.predefinedSkillIds.length > 0) {
      await tx.serviceSkill.createMany({
        data: input.predefinedSkillIds.map((skillId) => ({
          serviceId: service.id,
          skillId,
        })),
      });
    }

    if (input.customSkills.length > 0) {
      await tx.serviceCustomSkill.createMany({
        data: input.customSkills.map((name) => ({
          serviceId: service.id,
          name,
        })),
      });
    }

    await tx.serviceArea.createMany({
      data: input.serviceAreas.map((township) => ({
        serviceId: service.id,
        city: input.city,
        township,
      })),
    });

    return tx.service.findUniqueOrThrow({
      where: { id: service.id },
      select: providerServiceSelect,
    });
  });
};

export const findProviderServices = (providerId: string, cursor: string | undefined, take: number) => {
  return prisma.service.findMany({
    where: {
      providerId,
    },
    orderBy: [{ id: "asc" }],
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    take,
    select: providerServiceSelect,
  });
};

export const findProviderServiceById = (serviceId: string, providerId: string) => {
  return prisma.service.findFirst({
    where: {
      id: serviceId,
      providerId,
    },
    select: providerServiceSelect,
  });
};

export const updateProviderServiceWithRelations = (input: UpdateServiceInput) => {
  return prisma.$transaction(async (tx) => {
    await tx.service.update({
      where: { id: input.serviceId },
      data: input.data,
    });

    if (input.predefinedSkillIds && input.customSkills) {
      await tx.serviceSkill.deleteMany({
        where: {
          serviceId: input.serviceId,
        },
      });

      await tx.serviceCustomSkill.deleteMany({
        where: {
          serviceId: input.serviceId,
        },
      });

      if (input.predefinedSkillIds.length > 0) {
        await tx.serviceSkill.createMany({
          data: input.predefinedSkillIds.map((skillId) => ({
            serviceId: input.serviceId,
            skillId,
          })),
        });
      }

      if (input.customSkills.length > 0) {
        await tx.serviceCustomSkill.createMany({
          data: input.customSkills.map((name) => ({
            serviceId: input.serviceId,
            name,
          })),
        });
      }
    }

    if (input.serviceAreas) {
      await tx.serviceArea.deleteMany({
        where: {
          serviceId: input.serviceId,
        },
      });

      await tx.serviceArea.createMany({
        data: input.serviceAreas.map((township) => ({
          serviceId: input.serviceId,
          city: input.city,
          township,
        })),
      });
    }

    return tx.service.findUniqueOrThrow({
      where: { id: input.serviceId },
      select: providerServiceSelect,
    });
  });
};

export const activateProviderService = (serviceId: string, isVisible: boolean) => {
  return prisma.service.update({
    where: { id: serviceId },
    data: {
      isActive: true,
      isVisible,
    },
    select: providerServiceSelect,
  });
};

export const deactivateProviderService = (serviceId: string) => {
  return prisma.service.update({
    where: { id: serviceId },
    data: {
      isActive: false,
      isVisible: false,
    },
    select: providerServiceSelect,
  });
};

export const searchPublicServiceIds = (filters: PublicServiceSearchFilters) => {
  const distanceExpression = buildDistanceExpression(filters.latitude, filters.longitude);
  const whereParts: Prisma.Sql[] = [
    Prisma.sql`s."isActive" = true`,
    Prisma.sql`s."isVisible" = true`,
    Prisma.sql`pp."status" = 'APPROVED'`,
  ];

  if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    whereParts.push(
      Prisma.sql`(
        s."title" ILIKE ${searchTerm} OR
        p."username" ILIKE ${searchTerm} OR
        c."name" ILIKE ${searchTerm} OR
        EXISTS (
          SELECT 1
          FROM "ServiceSkill" ss_search
          INNER JOIN "Skill" sk_search ON sk_search.id = ss_search."skillId"
          WHERE ss_search."serviceId" = s.id
            AND sk_search."name" ILIKE ${searchTerm}
        ) OR
        EXISTS (
          SELECT 1
          FROM "ServiceCustomSkill" scs_search
          WHERE scs_search."serviceId" = s.id
            AND scs_search."name" ILIKE ${searchTerm}
        )
      )`,
    );
  }

  if (filters.categoryId) {
    whereParts.push(Prisma.sql`s."categoryId" = ${filters.categoryId}`);
  }

  if (filters.skillIds.length > 0) {
    whereParts.push(
      Prisma.sql`EXISTS (
        SELECT 1
        FROM "ServiceSkill" ss
        WHERE ss."serviceId" = s.id
          AND ss."skillId" IN (${Prisma.join(filters.skillIds)})
      )`,
    );
  }

  if (filters.township) {
    whereParts.push(
      Prisma.sql`EXISTS (
        SELECT 1
        FROM "ServiceArea" sa
        WHERE sa."serviceId" = s.id
          AND lower(sa."township") = ${filters.township}
      )`,
    );
  }

  if (filters.minPrice !== undefined) {
    whereParts.push(Prisma.sql`s."price" >= ${filters.minPrice}`);
  }

  if (filters.maxPrice !== undefined) {
    whereParts.push(Prisma.sql`s."price" <= ${filters.maxPrice}`);
  }

  if (filters.minRating !== undefined) {
    whereParts.push(Prisma.sql`pp."ratingAverage" >= ${filters.minRating}`);
  }

  if (filters.isAvailable !== undefined) {
    whereParts.push(Prisma.sql`s."isAvailable" = ${filters.isAvailable}`);
  }

  if (filters.noCompletedServices) {
    whereParts.push(
      Prisma.sql`NOT EXISTS (
        SELECT 1
        FROM "Booking" b
        WHERE b."providerId" = p.id
          AND b."status" = 'COMPLETED'
      )`,
    );
  }

  const cursorSql = buildPublicSearchCursorSql(
    filters.sort,
    filters.cursor,
    distanceExpression,
  );
  const orderSql = buildPublicSearchOrderSql(filters.sort, distanceExpression);

  return prisma.$queryRaw<PublicServiceSearchRow[]>`
    SELECT
      s.id AS "serviceId",
      s."createdAt" AS "createdAt",
      p."createdAt" AS "providerCreatedAt",
      s."price"::text AS "price",
      ${distanceExpression} AS "distanceKm"
    FROM "Service" s
    INNER JOIN "User" p ON p.id = s."providerId"
    INNER JOIN "ProviderProfile" pp ON pp."userId" = p.id
    INNER JOIN "Category" c ON c.id = s."categoryId"
    WHERE ${Prisma.join(whereParts, " AND ")}
    ${cursorSql}
    ORDER BY ${orderSql}
    LIMIT ${filters.take}
  `;
};

export const findPublicServicesByIds = (serviceIds: string[]) => {
  if (serviceIds.length === 0) {
    return Promise.resolve([]);
  }

  return prisma.service.findMany({
    where: {
      id: { in: serviceIds },
      isActive: true,
      isVisible: true,
      provider: {
        providerProfile: {
          status: "APPROVED",
        },
      },
    },
    select: publicServiceSelect,
  });
};
