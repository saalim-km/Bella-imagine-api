import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import logger from "../../shared/logger/logger";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";

// Centralized Error Handler
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if error is from Zod validation
  if (err instanceof ZodError) {
    logger.warn("Validation error");
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message: "Validation failed",
      errors: err.errors, // array of detailed validation issues from Zod
    });
  }

  // Default app error handling
  const statusCode: number = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

  logger.warn(message);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};
