import { Request, Response } from "express";

export interface IVendorController {
    getVendorDetails(req: Request, res: Response) : Promise<void>
    updateVendorDetails(req: Request, res: Response) : Promise<void>
}