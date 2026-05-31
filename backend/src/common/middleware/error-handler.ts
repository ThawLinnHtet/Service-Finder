import type { ErrorRequestHandler } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";
import { env } from "../../config/env";
import { AppError, ValidationError } from "../errors/app-error";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Image file is too large. Maximum size is 5MB"
        : error.message;

    res.status(400).json({
      success: false,
      message,
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof ValidationError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details,
    });
    return;
  }

  if (isPrismaConnectionError(error) || hasNetworkConnectionFailure(error)) {
    res.status(503).json({
      success: false,
      message: "Database temporarily unavailable. Please try again shortly",
    });
    return;
  }

  if (isPrismaUniqueConstraintError(error)) {
    res.status(409).json({
      success: false,
      message: "Resource already exists",
    });
    return;
  }

  const message =
    env.NODE_ENV === "production"
      ? "Internal server error"
      : normalizeUnknownErrorMessage(error);

  res.status(500).json({
    success: false,
    message,
  });
};

const normalizeUnknownErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object") {
    const payload = error as Record<string, unknown>;

    if (typeof payload.message === "string" && payload.message.trim().length > 0) {
      return payload.message;
    }

    try {
      return JSON.stringify(payload);
    } catch {
      return "Unexpected error object";
    }
  }

  return "Unexpected internal error";
};

const isPrismaConnectionError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const payload = error as Record<string, unknown>;
  const code = payload.code;

  return code === "P1001" || code === "P1002";
};

const hasNetworkConnectionFailure = (error: unknown): boolean => {
  const message = normalizeUnknownErrorMessage(error).toUpperCase();

  return (
    message.includes("EAI_AGAIN") ||
    message.includes("ENOTFOUND") ||
    message.includes("ECONNREFUSED") ||
    message.includes("ETIMEDOUT") ||
    message.includes("CAN'T REACH DATABASE SERVER")
  );
};

const isPrismaUniqueConstraintError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const payload = error as Record<string, unknown>;
  return payload.code === "P2002";
};
