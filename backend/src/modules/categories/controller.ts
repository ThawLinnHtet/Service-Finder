import type { Request, Response } from "express";
import { getCategories, getSkillsByCategory } from "./service";

export const listCategoriesController = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const categories = await getCategories();

  res.status(200).json({
    success: true,
    data: categories,
  });
};

export const listCategorySkillsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { categoryId } = req.params as { categoryId: string };
  const skills = await getSkillsByCategory(categoryId);

  res.status(200).json({
    success: true,
    data: skills,
  });
};
