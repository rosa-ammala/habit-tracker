import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

type ApiErrorWithMessage = {
  data?: {
    message?: unknown;
  };
  error?: unknown;
  message?: unknown;
  status?: unknown;
};

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (isFetchBaseQueryError(error)) {
    if (hasMessageData(error)) {
      return error.data.message;
    }

    if ("error" in error && typeof error.error === "string") {
      return error.error;
    }

    if (error.status === "FETCH_ERROR") {
      return "Could not connect to the server.";
    }
  }

  if (isSerializedError(error) && error.message) {
    return error.message;
  }

  if (isApiErrorWithMessage(error) && typeof error.message === "string") {
    return error.message;
  }

  return fallback;
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error
  );
}

function isSerializedError(error: unknown): error is SerializedError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  );
}

function isApiErrorWithMessage(error: unknown): error is ApiErrorWithMessage {
  return typeof error === "object" && error !== null;
}

function hasMessageData(
  error: FetchBaseQueryError
): error is FetchBaseQueryError & { data: { message: string } } {
  return (
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  );
}
