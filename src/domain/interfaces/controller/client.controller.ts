import { Request, Response } from "express";

export interface IClientController {
    logout(req: Request, res: Response) : Promise<void>
    refreshToken(req: Request, res: Response) : Promise<void>
    getVendors(req: Request, res: Response) : Promise<void>
    getCategories(req: Request, res: Response) : Promise<void>
    getVendorDetails(req: Request, res: Response) : Promise<void>
    getServiceDetails(req: Request, res: Response) : Promise<void>
    createPaymentIntent(req: Request, res: Response) : Promise<void>
    handleWebhook(req: Request, res: Response) : Promise<void>
    getClientDetails(req: Request, res: Response) : Promise<void>
    updateClientDetails(req: Request, res: Response) : Promise<void>
    getallBookings(req: Request, res: Response) : Promise<void>
    updateBookingStatus(req: Request, res: Response) : Promise<void>
    readAllNotifications(req: Request, res: Response) : Promise<void>
    getAllNotifications(req: Request, res: Response) : Promise<void>
    deleteNotifications(req: Request, res: Response) : Promise<void>
    createConversation(req: Request, res: Response) : Promise<void>
    fetchWalletWithPagination(req: Request, res: Response): Promise<void>
}