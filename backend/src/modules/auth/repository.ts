import { prisma } from "../../database/prisma";
import type {
  RegisterCustomerInput,
  RegisterProviderInput,
} from "./validation";
import type { UploadedImage } from "./types";

type ResolvedLocation = {
  city: string;
  township: string;
  address: string | null;
};

type ProviderRegistrationAssets = {
  nrcFront: UploadedImage;
  nrcBack: UploadedImage;
  selfie: UploadedImage;
};

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
};

export const findUsersByEmailOrPhone = (email: string, phone: string) => {
  return prisma.user.findMany({
    where: {
      OR: [{ email: email.toLowerCase() }, { phone }],
    },
    select: {
      email: true,
      phone: true,
    },
  });
};

export const createCustomer = (
  input: RegisterCustomerInput,
  passwordHash: string,
  location: ResolvedLocation,
) => {
  return prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role: "CUSTOMER",
      city: location.city,
      township: location.township,
      address: location.address,
      latitude: input.location.latitude,
      longitude: input.location.longitude,
    },
  });
};

export const registerProviderWithFirstService = (
  input: RegisterProviderInput,
  passwordHash: string,
  location: ResolvedLocation,
  assets: ProviderRegistrationAssets,
) => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        username: input.username,
        email: input.email,
        phone: input.phone,
        passwordHash,
      role: "PROVIDER",
      city: location.city,
      township: location.township,
      address: input.location.address ?? location.address,
      latitude: input.location.latitude,
      longitude: input.location.longitude,
      },
    });

    const providerProfile = await tx.providerProfile.create({
      data: {
        userId: user.id,
        about: input.about,
        nrcStateCode: input.nrcStateCode,
        nrcTownshipCode: input.nrcTownshipCode,
        nrcType: input.nrcType,
        nrcNumber: input.nrcNumber,
        primaryCategoryId: input.categoryId,
      },
    });

    await tx.providerDocument.create({
      data: {
        providerId: providerProfile.id,
        nrcFrontUrl: assets.nrcFront.url,
        nrcFrontPublicId: assets.nrcFront.publicId,
        nrcBackUrl: assets.nrcBack.url,
        nrcBackPublicId: assets.nrcBack.publicId,
        selfiePhotoUrl: assets.selfie.url,
        selfiePhotoPublicId: assets.selfie.publicId,
      },
    });

    const service = await tx.service.create({
      data: {
        providerId: user.id,
        categoryId: input.categoryId,
        title: input.title,
        description: input.about,
        price: input.price,
        experienceYears: input.experienceYears,
        isActive: true,
        isVisible: false,
        isAvailable: true,
      },
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

    return user;
  });
};

export const createRefreshToken = (
  userId: string,
  tokenHash: string,
  expiresAt: Date,
) => {
  return prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });
};

export const findRefreshTokenByHash = (tokenHash: string) => {
  return prisma.refreshToken.findUnique({
    where: { tokenHash },
    select: {
      userId: true,
      expiresAt: true,
    },
  });
};

export const deleteRefreshTokenByHash = (tokenHash: string) => {
  return prisma.refreshToken.deleteMany({
    where: { tokenHash },
  });
};

export const rotateRefreshToken = (
  oldTokenHash: string,
  userId: string,
  newTokenHash: string,
  expiresAt: Date,
) => {
  return prisma.$transaction(async (tx) => {
    await tx.refreshToken.deleteMany({
      where: {
        tokenHash: oldTokenHash,
        userId,
      },
    });

    await tx.refreshToken.create({
      data: {
        userId,
        tokenHash: newTokenHash,
        expiresAt,
      },
    });
  });
};

export const findUserAuthById = (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
    },
  });
};

export const findProviderProfileAuthByUserId = (userId: string) => {
  return prisma.providerProfile.findUnique({
    where: { userId },
    select: {
      status: true,
      rejectionReason: true,
    },
  });
};
