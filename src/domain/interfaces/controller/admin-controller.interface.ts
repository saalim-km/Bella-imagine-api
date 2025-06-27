import { Request, Response } from "express";

export interface IAdminController {
    logout(req: Request, res: Response) : Promise<void>
    refreshToken(req: Request, res: Response) : Promise<void>
    getUserDetails(req: Request, res: Response) : Promise<void>
    getVendoRequests(req: Request, res: Response) : Promise<void>
    updateBlockStatus(req: Request, res: Response) : Promise<void>
    updateVendorRequest(req: Request, res: Response) : Promise<void>
    createNewCategory(req: Request, res: Response) : Promise<void>
    getCategories(req: Request, res: Response) : Promise<void>
    updateCategoryStatus(req: Request, res: Response) : Promise<void>
    updateCategory(req: Request, res: Response) : Promise<void>
    getCatJoinRequests(req: Request, res: Response) : Promise<void>
    updateCatRequest(req: Request, res: Response) : Promise<void>
    getWallet(req: Request, res: Response) : Promise<void>
    fetchDashBoard(req: Request, res: Response) : Promise<void>
}