import { prisma } from "../../database/prisma";

type ProviderStatus = "PENDING" | "APPROVED" | "REJECTED";

type ListProvidersOptions = {
  status?: ProviderStatus;
  cursor?: string;
  limit: number;
};

export const findProvidersForAdminList = ({
  status,
  cursor,
  limit,
}: ListProvidersOptions) => {
  return prisma.providerProfile.findMany({
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
      rejectionReason: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          city: true,
          township: true,
        },
      },
      nrcState: {
        select: {
          code: true,
          name: true,
          nameMm: true,
        },
      },
      nrcTownship: {
        select: {
          code: true,
          codeMm: true,
          name: true,
          nameMm: true,
        },
      },
    },
  });
};

export const findProviderForAdminDetail = (providerId: string) => {
  return prisma.providerProfile.findUnique({
    where: { id: providerId },
    select: {
      id: true,
      about: true,
      status: true,
      rejectionReason: true,
      nrcType: true,
      nrcNumber: true,
      createdAt: true,
      updatedAt: true,
      nrcState: {
        select: {
          code: true,
          name: true,
          nameMm: true,
        },
      },
      nrcTownship: {
        select: {
          stateCode: true,
          code: true,
          codeMm: true,
          name: true,
          nameMm: true,
        },
      },
      documents: {
        select: {
          nrcFrontUrl: true,
          nrcBackUrl: true,
          selfiePhotoUrl: true,
          createdAt: true,
          updatedAt: true,
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
          providedServices: {
            orderBy: [{ createdAt: "asc" }],
            select: {
              id: true,
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
            },
          },
        },
      },
    },
  });
};

export const approveProviderById = (providerId: string) => {
  return prisma.$transaction(async (tx) => {
    const provider = await tx.providerProfile.findUnique({
      where: { id: providerId },
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            providedServices: {
              select: {
                id: true,
                categoryId: true,
                customSkills: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!provider) {
      return null;
    }

    const serviceSkillsToCreate: Array<{ serviceId: string; skillId: string }> = [];
    const customSkillIdsToDelete: string[] = [];

    for (const service of provider.user.providedServices) {
      const normalizedSkillNames = new Set<string>();

      for (const customSkill of service.customSkills) {
        const normalizedName = customSkill.name.trim();

        if (!normalizedName) {
          customSkillIdsToDelete.push(customSkill.id);
          continue;
        }

        if (normalizedSkillNames.has(normalizedName.toLowerCase())) {
          customSkillIdsToDelete.push(customSkill.id);
          continue;
        }

        normalizedSkillNames.add(normalizedName.toLowerCase());
        customSkillIdsToDelete.push(customSkill.id);

        const skill = await tx.skill.upsert({
          where: {
            categoryId_name: {
              categoryId: service.categoryId,
              name: normalizedName,
            },
          },
          update: {},
          create: {
            categoryId: service.categoryId,
            name: normalizedName,
          },
          select: {
            id: true,
          },
        });

        serviceSkillsToCreate.push({
          serviceId: service.id,
          skillId: skill.id,
        });
      }
    }

    if (serviceSkillsToCreate.length > 0) {
      await tx.serviceSkill.createMany({
        data: serviceSkillsToCreate,
        skipDuplicates: true,
      });
    }

    if (customSkillIdsToDelete.length > 0) {
      await tx.serviceCustomSkill.deleteMany({
        where: {
          id: {
            in: customSkillIdsToDelete,
          },
        },
      });
    }

    await tx.providerProfile.update({
      where: { id: providerId },
      data: {
        status: "APPROVED",
        rejectionReason: null,
      },
    });

    await tx.service.updateMany({
      where: {
        providerId: provider.userId,
        isActive: true,
      },
      data: {
        isVisible: true,
      },
    });

    return {
      providerId: provider.id,
      promotedSkillCount: serviceSkillsToCreate.length,
    };
  });
};

export const rejectProviderById = (providerId: string, rejectionReason: string) => {
  return prisma.$transaction(async (tx) => {
    const provider = await tx.providerProfile.findUnique({
      where: { id: providerId },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!provider) {
      return null;
    }

    await tx.providerProfile.update({
      where: { id: providerId },
      data: {
        status: "REJECTED",
        rejectionReason,
      },
    });

    await tx.service.updateMany({
      where: {
        providerId: provider.userId,
      },
      data: {
        isVisible: false,
      },
    });

    return {
      providerId: provider.id,
    };
  });
};
