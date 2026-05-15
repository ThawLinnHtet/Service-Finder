import { Router } from "express";
import { asyncHandler } from "../../common/middleware/async-handler";
import { validateRequest } from "../../common/middleware/validate-request";
import {
  listCategoriesController,
  listCategorySkillsController,
} from "./controller";
import { listCategorySkillsSchema } from "./validation";

const router = Router();

router.get("/", asyncHandler(listCategoriesController));

router.get(
  "/:categoryId/skills",
  validateRequest(listCategorySkillsSchema),
  asyncHandler(listCategorySkillsController),
);

export const categoriesRouter = router;
