import { Request, Response } from "express";

export interface IClientController {
    logout(req: Request, res: Response) : Promise<void>
    refreshToken(req: Request, res: Response) : Promise<void>
    getVendors(req: Request, res: Response) : Promise<void>
    getCategories(req: Request, res: Response) : Promise<void>
    getVendorDetails(req: Request, res: Response) : Promise<void>
    getServiceDetails(req: Request, res: Response) : Promise<void>
}