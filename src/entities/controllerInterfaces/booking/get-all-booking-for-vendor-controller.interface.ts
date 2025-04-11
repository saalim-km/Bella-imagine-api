import { Request, Response } from "express";

export interface IGetAllBookingForVendorController {
    handle(req : Request,res : Response):  Promise<void>
}