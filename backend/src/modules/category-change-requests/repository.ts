import { prisma } from "../../database/prisma";

type ListOptions = {
  status?: "PENDING" | "APPROVED" | "REJECTED";
  cursor?: string;
  limit: number;
};

type CreateRequestInput = {
  providerId: string;
  currentCategoryId: string;
  requestedCategoryId: string;
  title: string;
  reason: string;
  price: number;
  experienceYears: number;
  predefinedSkillIds: string[];
  customSkills: string[];
};

export const findProviderForCategoryChangeRequestByUserId = (userId: string) => {
  return prisma.providerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      userId: true,
      status: true,
      primaryCategoryId: true,
    },
  });
};

export const findFirstServiceCategoryByProviderUserId = (providerUserId: string) => {
  return prisma.service.findFirst({
    where: { providerId: providerUserId },
    orderBy: [{ createdAt: "asc" }],
    select: {
      categoryId: true,
    },
  });
};

export const hasPendingCategoryChangeRequest = async (providerId: string): Promise<boolean> => {
  const count = await prisma.providerCategoryChangeRequest.count({
    where: {
      providerId,
      status: "PENDING",
    },
  });

  return count > 0;
};

export const createCategoryChangeRequest = (input: CreateRequestInput) => {
  return prisma.providerCategoryChangeRequest.create({
    data: {
      providerId: input.providerId,
      currentCategoryId: input.currentCategoryId,
      requestedCategoryId: input.requestedCategoryId,
      title: input.title,
      reason: input.reason,
      price: input.price,
      experienceYears: input.experienceYears,
      predefinedSkillIds: input.predefinedSkillIds,
      customSkills: input.customSkills,
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
    },
  });
};

export const findCategoryChangeRequestsForAdminList = ({ status, cursor, limit }: ListOptions) => {
  return prisma.providerCategoryChangeRequest.findMany({
    where: {
      ...(status ? { status } : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    take: limit,
    select: {
      id: true,
      status: true,
      title: true,
      reason: true,
      price: true,
      experienceYears: true,
      reviewedAt: true,
      createdAt: true,
      provider: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      currentCategory: {
        select: {
          id: true,
          name: true,
        },
      },
      requestedCategory: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const findCategoryChangeRequestById = (requestId: string) => {
  return prisma.providerCategoryChangeRequest.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      status: true,
      title: true,
      reason: true,
      price: true,
      experienceYears: true,
      predefinedSkillIds: true,
      customSkills: true,
      adminRejectionReason: true,
      reviewedAt: true,
      createdAt: true,
      updatedAt: true,
      provider: {
        select: {
          id: true,
          userId: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      currentCategory: {
        select: {
          id: true,
          name: true,
        },
      },
      requestedCategory: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const approveCategoryChangeRequestById = (requestId: string) => {
  return prisma.$transaction(async (tx) => {
    const request = await tx.providerCategoryChangeRequest.findUnique({
      where: { id: requestId },
      select: {
        id: true,
        status: true,
        providerId: true,
        currentCategoryId: true,
        requestedCategoryId: true,
        title: true,
        price: true,
        experienceYears: true,
        predefinedSkillIds: true,
        customSkills: true,
        provider: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!request || request.status !== "PENDING") {
      return null;
    }

    const firstService = await tx.service.findFirst({
      where: { providerId: request.provider.userId },
      orderBy: [{ createdAt: "asc" }],
      select: { id: true },
    });

    if (!firstService) {
      throw new Error("Provider service profile not found");
    }

    await tx.providerProfile.update({
      where: { id: request.providerId },
      data: {
        primaryCategoryId: request.requestedCategoryId,
      },
    });

    await tx.service.update({
      where: { id: firstService.id },
      data: {
        categoryId: request.requestedCategoryId,
        title: request.title,
        price: request.price,
        experienceYears: request.experienceYears,
        isActive: true,
        isVisible: true,
      },
    });

    await tx.serviceSkill.deleteMany({
      where: {
        serviceId: firstService.id,
      },
    });

    await tx.serviceCustomSkill.deleteMany({
      where: {
        serviceId: firstService.id,
      },
    });

    if (request.predefinedSkillIds.length > 0) {
      await tx.serviceSkill.createMany({
        data: request.predefinedSkillIds.map((skillId) => ({
          serviceId: firstService.id,
          skillId,
        })),
      });
    }

    if (request.customSkills.length > 0) {
      await tx.serviceCustomSkill.createMany({
        data: request.customSkills.map((name) => ({
          serviceId: firstService.id,
          name,
        })),
      });
    }

    await tx.providerCategoryChangeRequest.update({
      where: { id: request.id },
      data: {
        status: "APPROVED",
        adminRejectionReason: null,
        reviewedAt: new Date(),
      },
    });

    return {
      requestId: request.id,
      status: "APPROVED" as const,
    };
  });
};

export const rejectCategoryChangeRequestById = (
  requestId: string,
  rejectionReason: string,
) => {
  return prisma.providerCategoryChangeRequest.updateMany({
    where: {
      id: requestId,
      status: "PENDING",
    },
    data: {
      status: "REJECTED",
      adminRejectionReason: rejectionReason,
      reviewedAt: new Date(),
    },
  });
};
