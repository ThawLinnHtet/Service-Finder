import { prisma } from "../../database/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { UploadedImage } from "../auth/types";
import type { ResubmitProviderInput, UpdateProviderProfileInput } from "./validation";

type ResolvedLocation = {
  city: string;
  township: string;
  address: string | null;
};

type ResubmitAssets = {
  nrcFront: UploadedImage;
  nrcBack: UploadedImage;
  selfie: UploadedImage;
};

type ResubmitProviderPayload = {
  input: ResubmitProviderInput;
  userId: string;
  location: ResolvedLocation;
  assets: ResubmitAssets;
};

type ProviderProfileUpdatePayload = {
  userId: string;
  input: UpdateProviderProfileInput;
  location: ResolvedLocation | null;
  serviceAreas: string[] | null;
};

const providerProfileSelect = {
  id: true,
  status: true,
  rejectionReason: true,
  about: true,
  ratingAverage: true,
  ratingCount: true,
  primaryCategory: {
    select: {
      id: true,
      name: true,
    },
  },
  user: {
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      city: true,
      township: true,
      address: true,
      latitude: true,
      longitude: true,
      createdAt: true,
      updatedAt: true,
      providedServices: {
        orderBy: { createdAt: "asc" },
        take: 1,
        select: {
          id: true,
          categoryId: true,
          title: true,
          description: true,
          price: true,
          experienceYears: true,
          isActive: true,
          isVisible: true,
          isAvailable: true,
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
            orderBy: { township: "asc" },
            select: {
              id: true,
              city: true,
              township: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.ProviderProfileSelect;

export const findProviderProfileByUserId = (userId: string) => {
  return prisma.providerProfile.findUnique({
    where: { userId },
    select: providerProfileSelect,
  });
};

export const findProviderProfileForResubmit = (userId: string) => {
  return prisma.providerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      userId: true,
      status: true,
      documents: {
        select: {
          id: true,
          nrcFrontPublicId: true,
          nrcBackPublicId: true,
          selfiePhotoPublicId: true,
        },
      },
      user: {
        select: {
          id: true,
        },
      },
    },
  });
};

export const findProviderResubmitDataByUserId = (userId: string) => {
  return prisma.providerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      status: true,
      rejectionReason: true,
      about: true,
      nrcStateCode: true,
      nrcTownshipCode: true,
      nrcType: true,
      nrcNumber: true,
      documents: {
        select: {
          nrcFrontUrl: true,
          nrcBackUrl: true,
          selfiePhotoUrl: true,
        },
      },
      user: {
        select: {
          username: true,
          email: true,
          phone: true,
          city: true,
          township: true,
          address: true,
          latitude: true,
          longitude: true,
          providedServices: {
            orderBy: [{ createdAt: "asc" }],
            take: 1,
            select: {
              categoryId: true,
              title: true,
              price: true,
              experienceYears: true,
              serviceSkills: {
                select: {
                  skillId: true,
                },
              },
              customSkills: {
                select: {
                  name: true,
                },
              },
              serviceAreas: {
                select: {
                  township: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const resubmitProviderVerification = async ({
  input,
  userId,
  location,
  assets,
}: ResubmitProviderPayload) => {
  return prisma.$transaction(async (tx) => {
    const provider = await tx.providerProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        documents: {
          select: {
            id: true,
            nrcFrontPublicId: true,
            nrcBackPublicId: true,
            selfiePhotoPublicId: true,
          },
        },
      },
    });

    if (!provider) {
      return null;
    }

    await tx.user.update({
      where: { id: userId },
      data: {
        city: location.city,
        township: location.township,
        address: input.location.address ?? location.address,
        latitude: input.location.latitude,
        longitude: input.location.longitude,
      },
    });

    await tx.providerProfile.update({
      where: { userId },
      data: {
        about: input.about,
        nrcStateCode: input.nrcStateCode,
        nrcTownshipCode: input.nrcTownshipCode,
        nrcType: input.nrcType,
        nrcNumber: input.nrcNumber,
        primaryCategoryId: input.categoryId,
        status: "PENDING",
        rejectionReason: null,
      },
    });

    if (provider.documents) {
      await tx.providerDocument.update({
        where: { providerId: provider.id },
        data: {
          nrcFrontUrl: assets.nrcFront.url,
          nrcFrontPublicId: assets.nrcFront.publicId,
          nrcBackUrl: assets.nrcBack.url,
          nrcBackPublicId: assets.nrcBack.publicId,
          selfiePhotoUrl: assets.selfie.url,
          selfiePhotoPublicId: assets.selfie.publicId,
        },
      });
    } else {
      await tx.providerDocument.create({
        data: {
          providerId: provider.id,
          nrcFrontUrl: assets.nrcFront.url,
          nrcFrontPublicId: assets.nrcFront.publicId,
          nrcBackUrl: assets.nrcBack.url,
          nrcBackPublicId: assets.nrcBack.publicId,
          selfiePhotoUrl: assets.selfie.url,
          selfiePhotoPublicId: assets.selfie.publicId,
        },
      });
    }

    const firstService = await tx.service.findFirst({
      where: { providerId: userId },
      orderBy: [{ createdAt: "asc" }],
      select: { id: true },
    });

    const service = firstService
      ? await tx.service.update({
          where: { id: firstService.id },
          data: {
            categoryId: input.categoryId,
            title: input.title,
            description: input.about,
            price: input.price,
            experienceYears: input.experienceYears,
            isActive: true,
            isVisible: false,
            isAvailable: true,
          },
          select: { id: true },
        })
      : await tx.service.create({
          data: {
            providerId: userId,
            categoryId: input.categoryId,
            title: input.title,
            description: input.about,
            price: input.price,
            experienceYears: input.experienceYears,
            isActive: true,
            isVisible: false,
            isAvailable: true,
          },
          select: { id: true },
        });

    await tx.serviceSkill.deleteMany({
      where: { serviceId: service.id },
    });

    await tx.serviceCustomSkill.deleteMany({
      where: { serviceId: service.id },
    });

    await tx.serviceArea.deleteMany({
      where: { serviceId: service.id },
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
        city: location.city,
        township,
      })),
    });

    await tx.service.updateMany({
      where: {
        providerId: userId,
      },
      data: {
        isVisible: false,
      },
    });

    return {
      providerId: provider.id,
      oldDocuments: provider.documents,
    };
  });
};

export const updateProviderProfile = async ({
  userId,
  input,
  location,
  serviceAreas,
}: ProviderProfileUpdatePayload) => {
  return prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        username: input.username,
        email: input.email,
        phone: input.phone,
        ...(input.location && location
          ? {
              city: location.city,
              township: location.township,
              address: input.location.address ?? location.address,
              latitude: input.location.latitude,
              longitude: input.location.longitude,
            }
          : {}),
      },
    });

    if (input.about !== undefined) {
      await tx.providerProfile.update({
        where: { userId },
        data: {
          about: input.about,
        },
      });
    }

    if (serviceAreas && location) {
      const services = await tx.service.findMany({
        where: { providerId: userId },
        select: { id: true },
      });

      await tx.serviceArea.deleteMany({
        where: {
          serviceId: {
            in: services.map((service) => service.id),
          },
        },
      });

      if (services.length > 0) {
        await tx.serviceArea.createMany({
          data: services.flatMap((service) =>
            serviceAreas.map((township) => ({
              serviceId: service.id,
              city: location.city,
              township,
            })),
          ),
        });
      }
    }

    return tx.providerProfile.findUnique({
      where: { userId },
      select: providerProfileSelect,
    });
  });
};
