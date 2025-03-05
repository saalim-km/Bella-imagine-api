import { Request, Response } from "express";

export interface ISendEmailController {
  handle(req: Request, res: Response): Promise<void>;
}