import { Request, Response } from "express";

export interface IGetUserConversationsController {
    handle(req : Request , res : Response) : Promise<void>
}