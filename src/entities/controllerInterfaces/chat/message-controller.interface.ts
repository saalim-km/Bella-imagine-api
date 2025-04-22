import { Request, Response } from "express";

export interface IMessageController {
    getMessagesController(req : Request , res : Response) : Promise<void>;
}