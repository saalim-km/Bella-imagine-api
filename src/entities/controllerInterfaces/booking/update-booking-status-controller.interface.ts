import { Request, Response } from "express";

export interface IUpdateBookingStatusController {
  handle(req: Request, res: Response): Promise<void>;
}
