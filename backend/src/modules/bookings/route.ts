import { Router } from "express";
import { asyncHandler } from "../../common/middleware/async-handler";
import { authorizeRoles, requireAuth } from "../../common/middleware/auth";
import { validateRequest } from "../../common/middleware/validate-request";
import {
  acceptBookingController,
  cancelBookingController,
  completeBookingController,
  createBookingController,
  getBookingController,
  listBookingsController,
  rejectBookingController,
} from "./controller";
import {
  bookingIdParamSchema,
  createBookingSchema,
  listBookingsSchema,
} from "./validation";

const router = Router();

router.post(
  "/",
  requireAuth,
  authorizeRoles("CUSTOMER", { message: "Only customers can create bookings" }),
  validateRequest(createBookingSchema),
  asyncHandler(createBookingController),
);

router.get(
  "/",
  requireAuth,
  authorizeRoles("CUSTOMER", "PROVIDER", {
    message: "Only customers and providers can view bookings",
  }),
  validateRequest(listBookingsSchema),
  asyncHandler(listBookingsController),
);

router.get(
  "/:bookingId",
  requireAuth,
  authorizeRoles("CUSTOMER", "PROVIDER", {
    message: "Only customers and providers can view bookings",
  }),
  validateRequest(bookingIdParamSchema),
  asyncHandler(getBookingController),
);

router.patch(
  "/:bookingId/accept",
  requireAuth,
  authorizeRoles("PROVIDER", { message: "Only providers can accept bookings" }),
  validateRequest(bookingIdParamSchema),
  asyncHandler(acceptBookingController),
);

router.patch(
  "/:bookingId/reject",
  requireAuth,
  authorizeRoles("PROVIDER", { message: "Only providers can reject bookings" }),
  validateRequest(bookingIdParamSchema),
  asyncHandler(rejectBookingController),
);

router.patch(
  "/:bookingId/cancel",
  requireAuth,
  authorizeRoles("CUSTOMER", { message: "Only customers can cancel bookings" }),
  validateRequest(bookingIdParamSchema),
  asyncHandler(cancelBookingController),
);

router.patch(
  "/:bookingId/complete",
  requireAuth,
  authorizeRoles("PROVIDER", { message: "Only providers can complete bookings" }),
  validateRequest(bookingIdParamSchema),
  asyncHandler(completeBookingController),
);

export const bookingsRouter = router;
