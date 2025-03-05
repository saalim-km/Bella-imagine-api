import { Request, Response } from "express";

export interface IVerifyOTPController {
    handle(req :  Request , res : Response) : Promise<void>
}