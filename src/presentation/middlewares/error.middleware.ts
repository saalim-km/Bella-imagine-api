import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import logger from "../../shared/logger/logger";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";

// Interface for structured validation errors
interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// Transform Zod errors to user-friendly format
const formatZodErrors = (zodError: ZodError): ValidationError[] => {
  return zodError.errors.map((error) => ({
    field: error.path.join('.'), // Convert path array to dot notation
    message: error.message,
    code: error.code
  }));
};
  

// ✅ Enhanced Error Handler with user-friendly Zod error formatting
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    logger.warn("Validation error", { errors: err.errors });
    
    const formattedErrors = formatZodErrors(err);
    
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message: "Validation failed",
      errors: formattedErrors,
      // Alternative: Use grouped format
      // errors: formatZodErrorsGrouped(err)
    });
    return;
  }

  // Handle custom or unknown errors
  const statusCode: number = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

  logger.warn(message);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

// ✅ Even more user-friendly version with summary message
export const errorHandlerWithSummary: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    logger.warn("Validation error", { errors: err.errors });
    
    const formattedErrors = formatZodErrors(err);
    const fieldCount = new Set(formattedErrors.map(e => e.field)).size;
    const summaryMessage = `Validation failed for ${fieldCount} field${fieldCount > 1 ? 's' : ''}`;
    
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message: summaryMessage,
      errors: formattedErrors
    });
    return;
  }

  const statusCode: number = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

  logger.warn(message);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};