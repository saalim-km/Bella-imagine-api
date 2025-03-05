import { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";


//  Centralized Error Hanlder
export const errorHandler = (

  err: any,
  req: Request,
  res: Response,
  next: NextFunction

) => {

  const statusCode: number =
    err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

  // Sending structured error response to user.
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });

};
