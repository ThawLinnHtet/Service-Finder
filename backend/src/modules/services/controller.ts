import type { Request, Response } from "express";
import { UnauthorizedError } from "../../common/errors/app-error";
import {
  activateService,
  createService,
  deactivateService,
  getOwnServiceById,
  listPublicServices,
  listOwnServices,
  updateService,
} from "./service";
import type {
  CreateProviderServiceInput,
  ListProviderServicesQuery,
  ListPublicServicesQuery,
  UpdateProviderServiceInput,
} from "./validation";

const getAuthUserId = (req: Request): string => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new UnauthorizedError("Authentication required");
  }

  return userId;
};

export const listOwnServicesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const query = req.validated?.query as ListProviderServicesQuery;
  const result = await listOwnServices(userId, query);

  res.status(200).json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
};

export const listPublicServicesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const query = req.validated?.query as ListPublicServicesQuery;
  const result = await listPublicServices(query);

  res.status(200).json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
};

export const getOwnServiceController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const { serviceId } = req.params as { serviceId: string };
  const service = await getOwnServiceById(userId, serviceId);

  res.status(200).json({
    success: true,
    data: service,
  });
};

export const createServiceController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const service = await createService(userId, req.body as CreateProviderServiceInput);

  res.status(201).json({
    success: true,
    message: "Service created successfully",
    data: service,
  });
};

export const updateServiceController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const { serviceId } = req.params as { serviceId: string };
  const service = await updateService(
    userId,
    serviceId,
    req.body as UpdateProviderServiceInput,
  );

  res.status(200).json({
    success: true,
    message: "Service updated successfully",
    data: service,
  });
};

export const activateServiceController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const { serviceId } = req.params as { serviceId: string };
  const service = await activateService(userId, serviceId);

  res.status(200).json({
    success: true,
    message: "Service activated successfully",
    data: service,
  });
};

export const deactivateServiceController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const { serviceId } = req.params as { serviceId: string };
  const service = await deactivateService(userId, serviceId);

  res.status(200).json({
    success: true,
    message: "Service deactivated successfully",
    data: service,
  });
};
