import { Request, Response } from "express";


export interface IChatController {
    uploadMedia(req: Request, res: Response) : Promise<void>
}