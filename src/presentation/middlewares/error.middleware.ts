import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import logger from "../../shared/logger/logger";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";

// ✅ Centralized Error Handler with correct typing
export const errorHandler: ErrorRequestHandler = (err, req, res,next) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    logger.warn("Validation error");
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message: "Validation failed",
      errors: err.errors,
    });
    return;
  }

  // Handle custom or unknown errors
  const statusCode: number =
    err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

  logger.warn(message);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};
