import { Request, Response } from "express";

export interface IGetVendorDetailsForChatController {
    handle(req: Request, res: Response): Promise<void>
}