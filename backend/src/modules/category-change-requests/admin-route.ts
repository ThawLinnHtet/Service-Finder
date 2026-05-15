import { Router } from "express";
import { asyncHandler } from "../../common/middleware/async-handler";
import { authorizeRoles, requireAuth } from "../../common/middleware/auth";
import { validateRequest } from "../../common/middleware/validate-request";
import {
  approveCategoryChangeRequestController,
  getCategoryChangeRequestController,
  listCategoryChangeRequestsController,
  rejectCategoryChangeRequestController,
} from "./controller";
import {
  categoryChangeRequestIdParamSchema,
  listCategoryChangeRequestsSchema,
  rejectCategoryChangeRequestSchema,
} from "./validation";

const router = Router();

router.use(requireAuth, authorizeRoles("ADMIN"));

router.get(
  "/",
  validateRequest(listCategoryChangeRequestsSchema),
  asyncHandler(listCategoryChangeRequestsController),
);

router.get(
  "/:requestId",
  validateRequest(categoryChangeRequestIdParamSchema),
  asyncHandler(getCategoryChangeRequestController),
);

router.patch(
  "/:requestId/approve",
  validateRequest(categoryChangeRequestIdParamSchema),
  asyncHandler(approveCategoryChangeRequestController),
);

router.patch(
  "/:requestId/reject",
  validateRequest(rejectCategoryChangeRequestSchema),
  asyncHandler(rejectCategoryChangeRequestController),
);

export const adminCategoryChangeRequestsRouter = router;
