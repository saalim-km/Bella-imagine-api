import { Request, Response } from "express";


export interface IUpdateUserStatusController {
    handle(req : Request , res : Response) : Promise<void>
} 