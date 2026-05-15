import type { Request, Response } from "express";
import {
  approveProviderRegistration,
  getProviderForAdmin,
  listProvidersForAdmin,
  rejectProviderRegistration,
} from "./service";
import type { ListProvidersQuery, RejectProviderInput } from "./validation";

export const listProvidersController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await listProvidersForAdmin(
    req.validated?.query as ListProvidersQuery,
  );

  res.status(200).json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
};

export const getProviderDetailController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { providerId } = req.params as { providerId: string };
  const provider = await getProviderForAdmin(providerId);

  res.status(200).json({
    success: true,
    data: provider,
  });
};

export const approveProviderController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { providerId } = req.params as { providerId: string };
  const result = await approveProviderRegistration(providerId);

  res.status(200).json({
    success: true,
    message: "Provider approved successfully",
    data: result,
  });
};

export const rejectProviderController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { providerId } = req.params as { providerId: string };
  const { rejectionReason } = req.body as RejectProviderInput;

  const result = await rejectProviderRegistration(providerId, rejectionReason);

  res.status(200).json({
    success: true,
    message: "Provider rejected successfully",
    data: result,
  });
};
