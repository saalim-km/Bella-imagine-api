import { Request , Response } from "express";
    
export interface IForgotPasswordSendOtpController {
    handle(req : Request , res :Response) : Promise<void>
}