import { Request, Response } from "express";

export interface ICreateNewCategoryController {
  handle(req: Request, res: Response): Promise<void>;
}
