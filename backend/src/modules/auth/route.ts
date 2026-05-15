import { Router } from "express";
import rateLimit from "express-rate-limit";
import { asyncHandler } from "../../common/middleware/async-handler";
import { providerVerificationUpload } from "../../common/middleware/upload";
import { validateRequest } from "../../common/middleware/validate-request";
import {
  adminLoginController,
  loginController,
  logoutController,
  refreshController,
  registerCustomerController,
  registerProviderController,
} from "./controller";
import {
  adminLoginSchema,
  loginSchema,
  registerCustomerSchema,
  registerProviderSchema,
} from "./validation";

const router = Router();

const adminLoginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many admin login attempts. Please try again later",
  },
});

router.post(
  "/register/customer",
  validateRequest(registerCustomerSchema),
  asyncHandler(registerCustomerController),
);

router.post(
  "/login",
  validateRequest(loginSchema),
  asyncHandler(loginController),
);

router.post(
  "/login/admin",
  adminLoginRateLimiter,
  validateRequest(adminLoginSchema),
  asyncHandler(adminLoginController),
);

router.post("/refresh", asyncHandler(refreshController));

router.post("/logout", asyncHandler(logoutController));

router.post(
  "/register/provider",
  providerVerificationUpload,
  validateRequest(registerProviderSchema),
  asyncHandler(registerProviderController),
);

export const authRouter = router;
