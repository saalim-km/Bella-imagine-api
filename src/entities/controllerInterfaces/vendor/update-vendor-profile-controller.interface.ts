import { Request, Response } from "express";

export interface IUpdateVendorController {
    handle(req : Request , res : Response) :Promise<void>
}