import { prisma } from "../../database/prisma";

export const findCategories = () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
};

export const findCategoryById = (categoryId: string) => {
  return prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
};

export const findSkillsByCategoryId = (categoryId: string) => {
  return prisma.skill.findMany({
    where: { categoryId },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
};
