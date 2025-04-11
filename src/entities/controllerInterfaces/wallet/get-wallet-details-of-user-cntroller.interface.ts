import { Request, Response } from "express";

export interface IGetWalletDetailsOfUserController {
  handle(req: Request, res: Response): Promise<void>;
}