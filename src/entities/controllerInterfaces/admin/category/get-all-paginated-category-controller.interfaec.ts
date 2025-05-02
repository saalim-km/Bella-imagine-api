  import { Request, Response } from "express";

  export interface IGetAllPaginatedCategoryController {
    handle(req: Request, res: Response): Promise<void>;
  }
