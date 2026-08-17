import type { NextFunction, Request, RequestHandler, Response } from "express";
import { toAppError } from "./errors";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export function asyncHandler(
  handler: AsyncRequestHandler,
  fallbackMessage = "Internal server error"
): RequestHandler {
  return (req, res, next) => {
    void handler(req, res, next).catch((error: unknown) => {
      next(toAppError(error, fallbackMessage));
    });
  };
}
