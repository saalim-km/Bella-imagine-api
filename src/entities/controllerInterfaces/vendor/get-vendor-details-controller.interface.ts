import { Request, Response } from "express";

export interface IGetVendorDetailsController {
    handle(req : Request , res : Response) :Promise<void>
}