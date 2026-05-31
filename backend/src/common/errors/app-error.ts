export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
    public readonly details?: unknown,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export type ValidationIssue = {
  field: string;
  message: string;
};

export class ValidationError extends AppError {
  constructor(public readonly errors: ValidationIssue[]) {
    super("Validation failed", 400);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: unknown) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409);
  }
}
