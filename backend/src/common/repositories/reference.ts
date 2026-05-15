import { prisma } from "../../database/prisma";

export const hasCategory = async (categoryId: string): Promise<boolean> => {
  const count = await prisma.category.count({ where: { id: categoryId } });
  return count > 0;
};

export const countSkillsByCategory = (skillIds: string[], categoryId: string) => {
  if (skillIds.length === 0) {
    return Promise.resolve(0);
  }

  return prisma.skill.count({
    where: {
      id: { in: skillIds },
      categoryId,
    },
  });
};

export const hasNrcState = async (stateCode: string): Promise<boolean> => {
  const count = await prisma.nrcState.count({ where: { code: stateCode } });
  return count > 0;
};

export const hasNrcTownshipInState = async (
  townshipCode: string,
  stateCode: string,
): Promise<boolean> => {
  const count = await prisma.nrcTownship.count({
    where: {
      code: townshipCode,
      stateCode,
    },
  });

  return count > 0;
};
