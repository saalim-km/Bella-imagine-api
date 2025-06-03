import { Request, Response } from "express";

export interface IAdminController {
    logout(req: Request, res: Response) : Promise<void>
}