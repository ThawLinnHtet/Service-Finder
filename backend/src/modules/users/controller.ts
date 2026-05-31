import type { Request, Response } from "express";
import { UnauthorizedError } from "../../common/errors/app-error";
import { env } from "../../config/env";
import {
  changeCurrentUserPassword,
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from "./service";
import type { ChangePasswordInput, UpdateCurrentUserProfileInput } from "./validation";

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

export const getCurrentUserProfileController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const profile = await getCurrentUserProfile(userId);

  res.status(200).json({
    success: true,
    data: profile,
  });
};

export const updateCurrentUserProfileController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getAuthUserId(req);
  const profile = await updateCurrentUserProfile(
    userId,
    req.body as UpdateCurrentUserProfileInput,
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: profile,
  });
};

export const changeCurrentUserPasswordController = async (
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
