import { Router } from "express";
import { asyncHandler } from "../../common/middleware/async-handler";
import { authorizeRoles, requireAuth } from "../../common/middleware/auth";
import { validateRequest } from "../../common/middleware/validate-request";
import { createCategoryChangeRequestController } from "./controller";
import { createCategoryChangeRequestSchema } from "./validation";

const router = Router();

router.post(
  "/",
  requireAuth,
  authorizeRoles("PROVIDER"),
  validateRequest(createCategoryChangeRequestSchema),
  asyncHandler(createCategoryChangeRequestController),
);

export const providerCategoryChangeRequestsRouter = router;
