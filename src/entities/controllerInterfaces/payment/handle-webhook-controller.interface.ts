import { Request, Response } from "express";

export interface IHandleWebHookController {
  handle(req: Request, res: Response): Promise<void>;
}