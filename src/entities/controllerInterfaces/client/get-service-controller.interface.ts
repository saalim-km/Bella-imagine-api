import { Request, Response } from "express";

export interface IGetServiceController {
    handle(req : Request , res : Response) : Promise<void>
}