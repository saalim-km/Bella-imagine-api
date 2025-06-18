import { Request, Response } from "express";

export interface IVendorController {
    getVendorDetails(req: Request, res: Response) : Promise<void>
    updateVendorDetails(req: Request, res: Response) : Promise<void>
    getVendorBookings(req: Request, res: Response) : Promise<void>
    getCategories(req: Request, res: Response) : Promise<void>
    joinCateoryRequest(req: Request, res: Response) : Promise<void>
    fetchWallet(req: Request, res: Response) : Promise<void>
    updateBookingStatus(req: Request, res: Response) : Promise<void>
    createService(req: Request, res: Response) : Promise<void>
    getServices(req: Request, res: Response) : Promise<void>
    updateService(req: Request, res: Response) : Promise<void>
    createWorkSample(req: Request, res: Response) : Promise<void>
    getWorkSamples(req: Request, res: Response) : Promise<void>
    deleteWorkSample(req: Request, res: Response) : Promise<void>
}