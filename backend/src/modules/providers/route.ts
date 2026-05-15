import { Router } from "express";
import { asyncHandler } from "../../common/middleware/async-handler";
import { authorizeRoles, requireAuth } from "../../common/middleware/auth";
import { providerVerificationUpload } from "../../common/middleware/upload";
import { validateRequest } from "../../common/middleware/validate-request";
import {
  getProviderResubmitDataController,
  resubmitProviderController,
} from "./controller";
import { resubmitProviderSchema } from "./validation";

const router = Router();

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
