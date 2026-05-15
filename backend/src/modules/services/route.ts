import { Router } from "express";
import { asyncHandler } from "../../common/middleware/async-handler";
import { authorizeRoles, requireAuth } from "../../common/middleware/auth";
import { validateRequest } from "../../common/middleware/validate-request";
import {
  activateServiceController,
  deactivateServiceController,
  getOwnServiceController,
  listOwnServicesController,
  updateServiceController,
} from "./controller";
import {
  listProviderServicesSchema,
  providerServiceIdParamSchema,
  updateProviderServiceSchema,
} from "./validation";

const router = Router();

router.use(requireAuth, authorizeRoles("PROVIDER"));

router.get(
  "/",
  validateRequest(listProviderServicesSchema),
  asyncHandler(listOwnServicesController),
);

router.get(
  "/:serviceId",
  validateRequest(providerServiceIdParamSchema),
  asyncHandler(getOwnServiceController),
);

router.patch(
  "/:serviceId",
  validateRequest(updateProviderServiceSchema),
  asyncHandler(updateServiceController),
);

router.patch(
  "/:serviceId/activate",
  validateRequest(providerServiceIdParamSchema),
  asyncHandler(activateServiceController),
);

router.patch(
  "/:serviceId/deactivate",
  validateRequest(providerServiceIdParamSchema),
  asyncHandler(deactivateServiceController),
);

export const servicesRouter = router;
