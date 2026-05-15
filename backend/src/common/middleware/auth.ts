import type { NextFunction, Request, RequestHandler, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ForbiddenError, UnauthorizedError } from "../errors/app-error";
import { env } from "../../config/env";

type AccessTokenPayload = {
  sub: string;
  role: string;
  type: "access";
};

declare module "express-serve-static-core" {
  interface Request {
    auth?: {
      userId: string;
      role: string;
    };
  }
}

const getAccessTokenFromRequest = (req: Request): string | null => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

    if (payload.type !== "access" || typeof payload.sub !== "string") {
      throw new UnauthorizedError("Invalid access token");
    }

    return {
      sub: payload.sub,
      role: typeof payload.role === "string" ? payload.role : "",
      type: "access",
    };
  } catch {
    throw new UnauthorizedError("Invalid access token");
  }
};

export const requireAuth: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = getAccessTokenFromRequest(req);

  if (!token) {
    next(new UnauthorizedError("Authentication required"));
    return;
  }

  const payload = verifyAccessToken(token);

  req.auth = {
    userId: payload.sub,
    role: payload.role,
  };

  next();
};

type AuthorizeRolesOptions = {
  message?: string;
};

export const authorizeRoles = (
  ...args: Array<string | AuthorizeRolesOptions>
): RequestHandler => {
  const maybeOptions = args[args.length - 1];
  const options =
    typeof maybeOptions === "object" && maybeOptions !== null
      ? maybeOptions
      : undefined;

  const roles = (options ? args.slice(0, -1) : args) as string[];
  const normalizedRoles = roles.map((role) => role.toUpperCase());
  const forbiddenMessage = options?.message ?? "Insufficient permissions";

  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      next(new UnauthorizedError("Authentication required"));
      return;
    }

    if (!normalizedRoles.includes(req.auth.role.toUpperCase())) {
      next(new ForbiddenError(forbiddenMessage));
      return;
    }

    next();
  };
};
