import type { Request, Response } from "express";
import { UnauthorizedError } from "../../common/errors/app-error";
import { getProviderResubmitData, resubmitProvider } from "./service";
import type { ResubmitProviderInput } from "./validation";

const getAuthUserId = (req: Request): string => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new UnauthorizedError("Authentication required");
  }

  return userId;
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
