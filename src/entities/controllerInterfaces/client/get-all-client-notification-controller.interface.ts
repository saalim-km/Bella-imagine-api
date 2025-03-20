import { Request, Response } from "express";

export interface IGetAllClientNotificationController {
    handle(req : Request , res : Response) : Promise<void>
}