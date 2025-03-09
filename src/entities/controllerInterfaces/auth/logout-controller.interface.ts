import { Request, Response } from "express";

export interface ILogoutController {
    handle(req : Request , res : Response): Promise<void>
}