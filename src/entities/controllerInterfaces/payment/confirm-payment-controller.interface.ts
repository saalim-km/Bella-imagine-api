import { Request, Response } from "express";

export interface IConfirmPaymenController {
  handle(req: Request, res: Response): Promise<void>;
}
