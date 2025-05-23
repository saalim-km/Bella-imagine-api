import { injectable } from "tsyringe";
import { BaseController } from "./base-controller";
import { Request, Response } from "express";

@injectable()
export class AuthController {
    sendOtp(req: Request, res: Response) {
        
    }
}