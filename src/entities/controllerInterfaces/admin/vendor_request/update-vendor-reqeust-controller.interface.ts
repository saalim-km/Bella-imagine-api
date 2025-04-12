import { Request, Response } from "express";
    
export interface IUpdateVendorRequestController {
    handle(req : Request , res : Response) : Promise<void>
}