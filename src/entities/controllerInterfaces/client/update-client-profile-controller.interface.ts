import { Request, Response } from "express";

export interface IUpdateClientController {
    handle(req : Request , res : Response) : Promise<void>
}