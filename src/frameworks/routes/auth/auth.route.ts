import { Request , Response } from "express";
import { BaseRoute } from "../base.route";
import { registerController, sendEmailController , veriryOtpController } from "../../di/resolver";

export class AuthRoute extends BaseRoute {
    constructor() {
        super()
    }

    protected initializeRoutes(): void {
        this.router.post('/register' , (req : Request , res : Response)=> {
            registerController.handle(req,res)
        });

        this.router.post('/send-otp',(req : Request ,res : Response)=> {
            sendEmailController.handle(req,res)
        }); 
        
        this.router.post('/verify-otp',(req :Request , res : Response)=> {
            veriryOtpController.handle(req,res)
        });
    }
}   