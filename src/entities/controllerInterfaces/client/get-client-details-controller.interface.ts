import { Request, Response } from "express";

export interface IGetClientDetailsController {
    handle(req : Request , res : Response) : Promise<void>
}