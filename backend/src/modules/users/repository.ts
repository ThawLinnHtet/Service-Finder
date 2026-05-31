import { prisma } from "../../database/prisma";
import type { UpdateCurrentUserProfileInput } from "./validation";

type ResolvedLocation = {
  city: string;
  township: string;
  address: string | null;
};

export const findUserProfileById = (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      role: true,
      city: true,
      township: true,
      address: true,
      latitude: true,
      longitude: true,
      createdAt: true,
      updatedAt: true,
      providerProfile: {
        select: {
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
        },
      },
    },
  });
};

export const findUserPasswordById = (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      passwordHash: true,
    },
  });
};

export const findEmailPhoneConflicts = (
  userId: string,
  email: string | undefined,
  phone: string | undefined,
) => {
  if (!email && !phone) {
    return Promise.resolve([]);
  }

  return prisma.user.findMany({
    where: {
      id: {
        not: userId,
      },
      OR: [
        ...(email ? [{ email: email.toLowerCase() }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    },
    select: {
      email: true,
      phone: true,
    },
  });
};

export const updateUserProfile = (
  userId: string,
  input: UpdateCurrentUserProfileInput,
  location: ResolvedLocation | null,
) => {
  return prisma.user.update({
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
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      role: true,
      city: true,
      township: true,
      address: true,
      latitude: true,
      longitude: true,
      createdAt: true,
      updatedAt: true,
      providerProfile: {
        select: {
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
        },
      },
    },
  });
};

export const updateUserPasswordAndRevokeSessions = (
  userId: string,
  passwordHash: string,
) => {
  return prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
      select: { id: true },
    }),
    prisma.refreshToken.deleteMany({
      where: { userId },
    }),
  ]);
};
