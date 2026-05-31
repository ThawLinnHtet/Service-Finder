import type { Request, Response } from "express";
import { UnauthorizedError } from "../../common/errors/app-error";
import {
  clearProviderHistory,
  getCustomerDashboard,
  getProviderDashboard,
  listCustomerDashboardBookings,
  listCustomerUpcomingBookingsForDashboard,
  listCustomerSavedServicesForDashboard,
  listProviderActiveNowJobs,
  listProviderDashboardClients,
  pinCustomer,
  saveService,
  unpinCustomer,
  unsaveService,
} from "./service";
import type {
  CustomerDashboardBookingsQuery,
  CustomerUpcomingBookingsQuery,
  DashboardPaginationQuery,
  ProviderDashboardClientsQuery,
} from "./validation";

const getAuthUserId = (req: Request): string => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new UnauthorizedError("Authentication required");
  }

  return userId;
};

export const getCustomerDashboardController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const data = await getCustomerDashboard(userId);

  res.status(200).json({
    success: true,
    data,
  });
};

export const listCustomerDashboardBookingsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const query = req.validated?.query as CustomerDashboardBookingsQuery;
  const result = await listCustomerDashboardBookings(userId, query);

  res.status(200).json({
    success: true,
    mode: result.mode,
    data: result.data,
    meta: result.meta,
  });
};

export const listCustomerUpcomingBookingsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const query = req.validated?.query as CustomerUpcomingBookingsQuery;
  const result = await listCustomerUpcomingBookingsForDashboard(userId, query);

  res.status(200).json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
};

export const listCustomerSavedServicesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const query = req.validated?.query as DashboardPaginationQuery;
  const result = await listCustomerSavedServicesForDashboard(userId, query);

  res.status(200).json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
};

export const saveServiceController = async (req: Request, res: Response): Promise<void> => {
  const userId = getAuthUserId(req);
  const { serviceId } = req.params as { serviceId: string };
  const data = await saveService(userId, serviceId);

  res.status(201).json({
    success: true,
    message: "Service saved successfully",
    data,
  });
};

export const unsaveServiceController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const { serviceId } = req.params as { serviceId: string };
  await unsaveService(userId, serviceId);

  res.status(200).json({
    success: true,
    message: "Service removed from saved list",
  });
};

export const getProviderDashboardController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const data = await getProviderDashboard(userId);

  res.status(200).json({
    success: true,
    data,
  });
};

export const listProviderDashboardClientsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const query = req.validated?.query as ProviderDashboardClientsQuery;
  const result = await listProviderDashboardClients(userId, query);

  res.status(200).json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
};

export const listProviderActiveNowJobsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const query = req.validated?.query as DashboardPaginationQuery;
  const result = await listProviderActiveNowJobs(userId, query);

  res.status(200).json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
};

export const pinProviderCustomerController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const { customerId } = req.params as { customerId: string };
  const data = await pinCustomer(userId, customerId);

  res.status(200).json({
    success: true,
    message: "Customer pinned successfully",
    data,
  });
};

export const unpinProviderCustomerController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const { customerId } = req.params as { customerId: string };
  await unpinCustomer(userId, customerId);

  res.status(200).json({
    success: true,
    message: "Customer unpinned successfully",
  });
};

export const clearProviderHistoryController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const result = await clearProviderHistory(userId);

  res.status(200).json({
    success: true,
    message: "Provider history cleared successfully",
    data: result,
  });
};
