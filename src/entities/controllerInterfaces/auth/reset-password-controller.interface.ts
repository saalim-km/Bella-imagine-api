import { Request , Response } from "express"
export interface IResetPasswordController {
    handle(req : Request , res : Response) : Promise<void>;
}