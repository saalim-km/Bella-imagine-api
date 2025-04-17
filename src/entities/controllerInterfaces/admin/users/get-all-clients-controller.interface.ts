import { Request, Response } from "express";

export interface IGetAllClientController {
    handle(req : Request , res : Response) : Promise<void>
}