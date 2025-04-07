import { Request, Response } from "express";

export interface ICreatePaymentIntentController {
  handle(req: Request, res: Response): Promise<void>;
}
