import type { Request, Response } from "express";
import { env } from "../../config/env";
import {
  loginAdmin,
  login,
  logout,
  refreshAuthSession,
  registerCustomer,
  registerProvider,
} from "./service";
import type { AuthResponse } from "./types";
import type {
  AdminLoginInput,
  LoginInput,
  RegisterCustomerInput,
  RegisterProviderInput,
} from "./validation";

const REFRESH_COOKIE_NAME = "refreshToken";

export const registerCustomerController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await registerCustomer(req.body as RegisterCustomerInput);

  setRefreshCookie(res, result.refreshToken);

  res.status(201).json({
    success: true,
    message: "Customer registered successfully",
    data: toResponseData(result),
  });
};

export const loginController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await login(req.body as LoginInput);

  setRefreshCookie(res, result.refreshToken);

  const message =
    result.user.role === "PROVIDER" && result.user.providerStatus === "PENDING"
      ? "Provider account is waiting for admin approval"
      : result.user.role === "PROVIDER" && result.user.providerStatus === "REJECTED"
        ? "Provider account was rejected. Please resubmit for review"
        : "Login successful";

  res.status(200).json({
    success: true,
    message,
    data: toResponseData(result),
  });
};

export const adminLoginController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await loginAdmin(req.body as AdminLoginInput);

  setRefreshCookie(res, result.refreshToken);

  res.status(200).json({
    success: true,
    message: "Admin login successful",
    data: toResponseData(result),
  });
};

export const registerProviderController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await registerProvider(
    req.body as RegisterProviderInput,
    req.files,
  );

  setRefreshCookie(res, result.refreshToken);

  res.status(201).json({
    success: true,
    message: "Provider registered successfully. Waiting for admin approval",
    data: toResponseData(result),
  });
};

export const refreshController = async (req: Request, res: Response): Promise<void> => {
  const result = await refreshAuthSession(req.cookies?.[REFRESH_COOKIE_NAME]);

  setRefreshCookie(res, result.refreshToken);

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: {
      accessToken: result.accessToken,
    },
  });
};

export const logoutController = async (req: Request, res: Response): Promise<void> => {
  await logout(req.cookies?.[REFRESH_COOKIE_NAME]);

  clearRefreshCookie(res);

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

const setRefreshCookie = (res: Response, refreshToken: string): void => {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshCookie = (res: Response): void => {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

const toResponseData = (result: AuthResponse) => {
  return {
    user: result.user,
    accessToken: result.accessToken,
  };
};
