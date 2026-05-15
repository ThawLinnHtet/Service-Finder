import { Router } from "express";
import { asyncHandler } from "../../common/middleware/async-handler";
import { validateRequest } from "../../common/middleware/validate-request";
import { listPublicServicesController } from "./controller";
import { listPublicServicesSchema } from "./validation";

const router = Router();

router.get(
  "/",
  validateRequest(listPublicServicesSchema),
  asyncHandler(listPublicServicesController),
);

export const publicServicesRouter = router;
