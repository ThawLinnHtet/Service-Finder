import { Router } from "express";
import { asyncHandler } from "../../common/middleware/async-handler";
import { authorizeRoles, requireAuth } from "../../common/middleware/auth";
import { validateRequest } from "../../common/middleware/validate-request";
import {
  approveProviderController,
  getProviderDetailController,
  listProvidersController,
  rejectProviderController,
} from "./controller";
import {
  listProvidersSchema,
  providerIdParamSchema,
  rejectProviderSchema,
} from "./validation";

const router = Router();

router.use(requireAuth, authorizeRoles("ADMIN"));

router.get("/", validateRequest(listProvidersSchema), asyncHandler(listProvidersController));

router.get(
  "/:providerId",
  validateRequest(providerIdParamSchema),
  asyncHandler(getProviderDetailController),
);

router.patch(
  "/:providerId/approve",
  validateRequest(providerIdParamSchema),
  asyncHandler(approveProviderController),
);

router.patch(
  "/:providerId/reject",
  validateRequest(rejectProviderSchema),
  asyncHandler(rejectProviderController),
);

export const adminProvidersRouter = router;
