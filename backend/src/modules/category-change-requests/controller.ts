import type { Request, Response } from "express";
import { UnauthorizedError } from "../../common/errors/app-error";
import {
  approveCategoryChangeRequest,
  getCategoryChangeRequestForAdmin,
  listCategoryChangeRequestsForAdmin,
  rejectCategoryChangeRequest,
  submitCategoryChangeRequest,
} from "./service";
import type {
  CreateCategoryChangeRequestInput,
  ListCategoryChangeRequestsQuery,
  RejectCategoryChangeRequestInput,
} from "./validation";

const getAuthUserId = (req: Request): string => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new UnauthorizedError("Authentication required");
  }

  return userId;
};

export const createCategoryChangeRequestController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const request = await submitCategoryChangeRequest(
    userId,
    req.body as CreateCategoryChangeRequestInput,
  );

  res.status(201).json({
    success: true,
    message: "Category change request submitted successfully",
    data: request,
  });
};

export const listCategoryChangeRequestsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const query = req.validated?.query as ListCategoryChangeRequestsQuery;
  const result = await listCategoryChangeRequestsForAdmin(query);

  res.status(200).json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
};

export const getCategoryChangeRequestController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { requestId } = req.params as { requestId: string };
  const request = await getCategoryChangeRequestForAdmin(requestId);

  res.status(200).json({
    success: true,
    data: request,
  });
};

export const approveCategoryChangeRequestController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { requestId } = req.params as { requestId: string };
  const result = await approveCategoryChangeRequest(requestId);

  res.status(200).json({
    success: true,
    message: "Category change request approved successfully",
    data: result,
  });
};

export const rejectCategoryChangeRequestController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { requestId } = req.params as { requestId: string };
  const { rejectionReason } = req.body as RejectCategoryChangeRequestInput;
  const result = await rejectCategoryChangeRequest(requestId, rejectionReason);

  res.status(200).json({
    success: true,
    message: "Category change request rejected successfully",
    data: result,
  });
};
