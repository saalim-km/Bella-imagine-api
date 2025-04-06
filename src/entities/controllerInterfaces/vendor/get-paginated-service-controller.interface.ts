import { Request, Response } from "express";

export interface IGetAllPaginatedServicesController {
    handle(req: Request, res: Response): Promise<void>;
}