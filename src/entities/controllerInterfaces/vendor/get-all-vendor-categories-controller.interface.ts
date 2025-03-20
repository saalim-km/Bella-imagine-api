import { Request, Response } from "express";

export interface IGetAllVendorCateoriesController {
  handle(req: Request, res: Response): Promise<void>;
}
