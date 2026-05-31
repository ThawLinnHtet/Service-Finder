import { Router } from "express";
import { asyncHandler } from "../../common/middleware/async-handler";
import { requireAuth } from "../../common/middleware/auth";
import { validateRequest } from "../../common/middleware/validate-request";
import {
  changeCurrentUserPasswordController,
  getCurrentUserProfileController,
  updateCurrentUserProfileController,
} from "./controller";
import { changePasswordSchema, updateCurrentUserProfileSchema } from "./validation";

const router = Router();

router.use(requireAuth);

router.get("/me", asyncHandler(getCurrentUserProfileController));

router.patch(
  "/me",
  validateRequest(updateCurrentUserProfileSchema),
  asyncHandler(updateCurrentUserProfileController),
);

router.patch(
  "/me/password",
  validateRequest(changePasswordSchema),
  asyncHandler(changeCurrentUserPasswordController),
);

export const usersRouter = router;
