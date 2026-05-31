import { AppError } from "../../common/errors/app-error";
import {
  findCategories,
  findCategoryById,
  findSkillsByCategoryId,
} from "./repository";

export const getCategories = () => {
  return findCategories();
};

export const getSkillsByCategory = async (categoryId: string) => {
  const category = await findCategoryById(categoryId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return findSkillsByCategoryId(categoryId);
};
