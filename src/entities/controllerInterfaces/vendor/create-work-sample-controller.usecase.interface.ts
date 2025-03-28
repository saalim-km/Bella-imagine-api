import { Request, Response } from "express";

export interface ICreateWorkSampleController {
  handle(req: Request, res: Response): Promise<void>;
}
