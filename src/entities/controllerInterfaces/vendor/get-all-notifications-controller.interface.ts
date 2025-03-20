import { Request, Response } from "express";

export interface IGetAllVendorNotificationController {
  handle(req: Request, res: Response): Promise<void>;
}
