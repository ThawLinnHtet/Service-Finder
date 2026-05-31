import { Router } from "express";
import { asyncHandler } from "../../common/middleware/async-handler";
import { authorizeRoles, requireAuth } from "../../common/middleware/auth";
import { providerVerificationUpload } from "../../common/middleware/upload";
import { validateRequest } from "../../common/middleware/validate-request";
import {
  changeProviderPasswordController,
  getProviderProfileController,
  getProviderResubmitDataController,
  resubmitProviderController,
  updateProviderProfileController,
} from "./controller";
import { changePasswordSchema } from "../users/validation";
import { resubmitProviderSchema, updateProviderProfileSchema } from "./validation";

const router = Router();

router.get(
  "/profile",
  requireAuth,
  authorizeRoles("PROVIDER"),
  asyncHandler(getProviderProfileController),
);

router.patch(
  "/profile",
  requireAuth,
  authorizeRoles("PROVIDER"),
  validateRequest(updateProviderProfileSchema),
  asyncHandler(updateProviderProfileController),
);

router.patch(
  "/profile/password",
  requireAuth,
  authorizeRoles("PROVIDER"),
  validateRequest(changePasswordSchema),
  asyncHandler(changeProviderPasswordController),
);

router.get(
  "/resubmit-data",
  requireAuth,
  authorizeRoles("PROVIDER"),
  asyncHandler(getProviderResubmitDataController),
);

router.patch(
  "/resubmit",
  requireAuth,
  authorizeRoles("PROVIDER"),
  providerVerificationUpload,
  validateRequest(resubmitProviderSchema),
  asyncHandler(resubmitProviderController),
);

export const providersRouter = router;
