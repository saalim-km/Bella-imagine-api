import { Request, Response } from "express";

export interface IGetAllPaginatedWorkSampleController {
    handle(req: Request, res: Response): Promise<void>;
}