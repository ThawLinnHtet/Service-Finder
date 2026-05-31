import type { Request, Response } from "express";
import { UnauthorizedError } from "../../common/errors/app-error";
import { env } from "../../config/env";
import { changeCurrentUserPassword } from "../users/service";
import {
  getProviderProfile,
  getProviderResubmitData,
  resubmitProvider,
  updateProviderProfileDetails,
} from "./service";
import type { ChangePasswordInput } from "../users/validation";
import type { ResubmitProviderInput, UpdateProviderProfileInput } from "./validation";

const getAuthUserId = (req: Request): string => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new UnauthorizedError("Authentication required");
  }

  return userId;
};

const clearRefreshCookie = (res: Response): void => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export const resubmitProviderController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const result = await resubmitProvider(
    userId,
    req.body as ResubmitProviderInput,
    req.files,
  );

  res.status(200).json({
    success: true,
    message: result.message,
    data: {
      providerStatus: result.providerStatus,
    },
  });
};

export const getProviderResubmitDataController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const data = await getProviderResubmitData(userId);

  res.status(200).json({
    success: true,
    data,
  });
};

export const getProviderProfileController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const data = await getProviderProfile(userId);

  res.status(200).json({
    success: true,
    data,
  });
};

export const updateProviderProfileController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const data = await updateProviderProfileDetails(
    userId,
    req.body as UpdateProviderProfileInput,
  );

  res.status(200).json({
    success: true,
    message: "Provider profile updated successfully",
    data,
  });
};

export const changeProviderPasswordController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  await changeCurrentUserPassword(userId, req.body as ChangePasswordInput);
  clearRefreshCookie(res);

  res.status(200).json({
    success: true,
    message: "Password changed successfully. Please log in again",
  });
};
