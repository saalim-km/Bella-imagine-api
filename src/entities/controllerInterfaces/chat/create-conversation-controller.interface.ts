import { Request, Response } from "express";

export interface ICreateConversationController {
    handle(req : Request , res : Response): Promise<void>
}