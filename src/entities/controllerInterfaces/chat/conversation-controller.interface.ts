import { Request, Response } from "express";

export interface IConversationController {
    createConversationController(req: Request, res: Response): Promise<void>;
    getUserConversationsController(req: Request, res: Response): Promise<void>;
}