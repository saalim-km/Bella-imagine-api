import { Response } from "express";

export class ResponseHandler {
  static success(res: Response, message: string, data: any = null, status = 200): Response {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, message: string, error: any = null, status = 400): Response {
    return res.status(status).json({
      success: false,
      message,
      error,
    });
  }
}
