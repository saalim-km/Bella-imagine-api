import { Request, Response } from "express";

export interface IGetAllTransactionsByUserIdController {
  handle(req: Request, res: Response): Promise<void>;
}
