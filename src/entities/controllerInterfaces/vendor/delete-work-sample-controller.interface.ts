import { Request, Response } from "express";

export interface IDeleteWorkSampleController {
  handle(req: Request, res: Response): Promise<void>;
}
