import type { ErrorRequestHandler } from "express";

type ErrorResponse = {
  code: string;
  message: string;
};

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
  }
}

export function isKnownServiceError(error: unknown): error is Error {
  return error instanceof Error && error.message in serviceErrorMap;
}

export function toAppError(error: unknown, fallbackMessage: string) {
  if (error instanceof AppError) {
    return error;
  }

  if (isKnownServiceError(error)) {
    const mappedError = serviceErrorMap[error.message];
    return new AppError(
      mappedError.statusCode,
      mappedError.code,
      mappedError.message
    );
  }

  if (isPrismaErrorCode(error, "P2002")) {
    return new AppError(
      409,
      "LOG_ALREADY_EXISTS",
      "Log already exists for this date"
    );
  }

  if (isPrismaErrorCode(error, "P2025")) {
    return new AppError(404, "LOG_NOT_FOUND", "Log not found");
  }

  if (isHttpErrorType(error, "entity.too.large")) {
    return new AppError(413, "PAYLOAD_TOO_LARGE", "Request body is too large");
  }

  if (isHttpErrorType(error, "entity.parse.failed")) {
    return new AppError(400, "INVALID_JSON", "Invalid JSON body");
  }

  return new AppError(500, "INTERNAL_ERROR", fallbackMessage);
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const appError = toAppError(error, "Internal server error");

  if (appError.statusCode >= 500) {
    console.error(error);
  }

  const response: ErrorResponse = {
    code: appError.code,
    message: appError.message,
  };

  res.status(appError.statusCode).json(response);
};

const serviceErrorMap: Record<
  string,
  { statusCode: number; code: string; message: string }
> = {
  CATEGORY_NOT_FOUND: {
    statusCode: 404,
    code: "CATEGORY_NOT_FOUND",
    message: "Category not found",
  },
  FUTURE_DATE_NOT_ALLOWED: {
    statusCode: 400,
    code: "FUTURE_DATE_NOT_ALLOWED",
    message: "Cannot log future dates",
  },
  HABIT_NOT_FOUND: {
    statusCode: 404,
    code: "HABIT_NOT_FOUND",
    message: "Habit not found",
  },
  INVALID_DATE: {
    statusCode: 400,
    code: "INVALID_DATE",
    message: "Invalid date",
  },
};

function isPrismaErrorCode(error: unknown, code: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

function isHttpErrorType(error: unknown, type: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    error.type === type
  );
}
