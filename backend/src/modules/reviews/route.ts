import { Router } from "express";
import { asyncHandler } from "../../common/middleware/async-handler";
import { authorizeRoles, requireAuth } from "../../common/middleware/auth";
import { validateRequest } from "../../common/middleware/validate-request";
import {
  createBookingReviewController,
  listCustomerReviewsController,
  listProviderReviewsController,
  listServiceReviewsController,
} from "./controller";
import {
  createBookingReviewSchema,
  listCustomerReviewsSchema,
  listProviderReviewsSchema,
  listServiceReviewsSchema,
} from "./validation";

const bookingReviewsRouter = Router();
const serviceReviewsRouter = Router();
const providerReviewsRouter = Router();
const customerReviewsRouter = Router();

bookingReviewsRouter.post(
  "/:bookingId/review",
  requireAuth,
  authorizeRoles("CUSTOMER", { message: "Only customers can create reviews" }),
  validateRequest(createBookingReviewSchema),
  asyncHandler(createBookingReviewController),
);

serviceReviewsRouter.get(
  "/:serviceId/reviews",
  validateRequest(listServiceReviewsSchema),
  asyncHandler(listServiceReviewsController),
);

providerReviewsRouter.get(
  "/",
  requireAuth,
  authorizeRoles("PROVIDER", { message: "Only providers can view provider reviews" }),
  validateRequest(listProviderReviewsSchema),
  asyncHandler(listProviderReviewsController),
);

customerReviewsRouter.get(
  "/",
  requireAuth,
  authorizeRoles("CUSTOMER", { message: "Only customers can view customer reviews" }),
  validateRequest(listCustomerReviewsSchema),
  asyncHandler(listCustomerReviewsController),
);

export {
  bookingReviewsRouter,
  customerReviewsRouter,
  providerReviewsRouter,
  serviceReviewsRouter,
};
