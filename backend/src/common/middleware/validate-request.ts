import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { z } from "zod";
import { ValidationError, type ValidationIssue } from "../errors/app-error";

declare module "express-serve-static-core" {
  interface Request {
    validated?: {
      body?: unknown;
      params?: unknown;
      query?: unknown;
    };
  }
}

type RequestSchema = z.ZodType<{
  body?: unknown;
  params?: unknown;
  query?: unknown;
}>;

export const validateRequest = (schema: RequestSchema): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errors: ValidationIssue[] = result.error.issues.map((issue) => ({
        field: issue.path
          .filter((path) => path !== "body" && path !== "query" && path !== "params")
          .join("."),
        message: issue.message,
      }));

      next(new ValidationError(errors));
      return;
    }

    if (result.data.body !== undefined) {
      req.body = result.data.body;
    }

    if (result.data.params !== undefined) {
      req.params = result.data.params as Record<string, string>;
    }

    req.validated = result.data;

    next();
  };
};
