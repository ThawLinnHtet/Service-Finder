import { Router } from "express";
import { asyncHandler } from "../../common/middleware/async-handler";
import { authorizeRoles, requireAuth } from "../../common/middleware/auth";
import { validateRequest } from "../../common/middleware/validate-request";
import {
  clearProviderHistoryController,
  getCustomerDashboardController,
  getProviderDashboardController,
  listCustomerDashboardBookingsController,
  listCustomerUpcomingBookingsController,
  listCustomerSavedServicesController,
  listProviderActiveNowJobsController,
  listProviderDashboardClientsController,
  pinProviderCustomerController,
  saveServiceController,
  unpinProviderCustomerController,
  unsaveServiceController,
} from "./controller";
import {
  customerDashboardBookingsSchema,
  customerUpcomingBookingsSchema,
  dashboardCustomerParamSchema,
  dashboardPaginationSchema,
  dashboardServiceParamSchema,
  providerDashboardClientsSchema,
} from "./validation";

const customerDashboardRouter = Router();
const providerDashboardRouter = Router();

customerDashboardRouter.use(
  requireAuth,
  authorizeRoles("CUSTOMER", {
    message: "Only customers can access customer dashboard",
  }),
);

customerDashboardRouter.get("/dashboard", asyncHandler(getCustomerDashboardController));

customerDashboardRouter.get(
  "/dashboard/bookings",
  validateRequest(customerDashboardBookingsSchema),
  asyncHandler(listCustomerDashboardBookingsController),
);

customerDashboardRouter.get(
  "/dashboard/upcoming-bookings",
  validateRequest(customerUpcomingBookingsSchema),
  asyncHandler(listCustomerUpcomingBookingsController),
);

customerDashboardRouter.get(
  "/saved-services",
  validateRequest(dashboardPaginationSchema),
  asyncHandler(listCustomerSavedServicesController),
);

customerDashboardRouter.post(
  "/saved-services/:serviceId",
  validateRequest(dashboardServiceParamSchema),
  asyncHandler(saveServiceController),
);

customerDashboardRouter.delete(
  "/saved-services/:serviceId",
  validateRequest(dashboardServiceParamSchema),
  asyncHandler(unsaveServiceController),
);

providerDashboardRouter.use(
  requireAuth,
  authorizeRoles("PROVIDER", {
    message: "Only providers can access provider dashboard",
  }),
);

providerDashboardRouter.get("/dashboard", asyncHandler(getProviderDashboardController));

providerDashboardRouter.get(
  "/dashboard/clients",
  validateRequest(providerDashboardClientsSchema),
  asyncHandler(listProviderDashboardClientsController),
);

providerDashboardRouter.get(
  "/dashboard/active-jobs",
  validateRequest(dashboardPaginationSchema),
  asyncHandler(listProviderActiveNowJobsController),
);

providerDashboardRouter.post(
  "/dashboard/clients/:customerId/pin",
  validateRequest(dashboardCustomerParamSchema),
  asyncHandler(pinProviderCustomerController),
);

providerDashboardRouter.delete(
  "/dashboard/clients/:customerId/pin",
  validateRequest(dashboardCustomerParamSchema),
  asyncHandler(unpinProviderCustomerController),
);

providerDashboardRouter.delete(
  "/dashboard/clients/history",
  asyncHandler(clearProviderHistoryController),
);

export { customerDashboardRouter, providerDashboardRouter };
