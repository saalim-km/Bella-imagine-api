import { Request, Response } from "express";

export interface IUpdateCategoryRequestStatusController {
    handle(req : Request , res : Response) :Promise<void>
}