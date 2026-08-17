import type { ErrorRequestHandler } from "express";

type ErrorResponse = {
  message: string;
};

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
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
    return new AppError(mappedError.statusCode, mappedError.message);
  }

  if (isPrismaErrorCode(error, "P2002")) {
    return new AppError(409, "Log already exists for this date");
  }

  if (isPrismaErrorCode(error, "P2025")) {
    return new AppError(404, "Log not found");
  }

  return new AppError(500, fallbackMessage);
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (!(error instanceof AppError) || error.statusCode >= 500) {
    console.error(error);
  }

  const response: ErrorResponse = {
    message: error instanceof AppError ? error.message : "Internal server error",
  };

  res
    .status(error instanceof AppError ? error.statusCode : 500)
    .json(response);
};

const serviceErrorMap: Record<string, { statusCode: number; message: string }> = {
  CATEGORY_NOT_FOUND: {
    statusCode: 404,
    message: "Category not found",
  },
  FUTURE_DATE_NOT_ALLOWED: {
    statusCode: 400,
    message: "Cannot log future dates",
  },
  HABIT_NOT_FOUND: {
    statusCode: 404,
    message: "Habit not found",
  },
  INVALID_DATE: {
    statusCode: 400,
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
