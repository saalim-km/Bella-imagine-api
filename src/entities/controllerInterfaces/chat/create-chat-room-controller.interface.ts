import { Request, Response } from "express";

export interface ICreateChatRoomController {
    handle(req: Request, res: Response): Promise<void>
}