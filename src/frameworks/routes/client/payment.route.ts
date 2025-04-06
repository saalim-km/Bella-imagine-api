import { authorizeRole, verifyAuth } from "../../../interfaceAdapters/middlewares/auth.middleware";
import { BaseRoute } from "../base.route";
import { Request, Response } from "express";


export class PaymentRoute extends BaseRoute {
    constructor() {
        super()
    }

    protected initializeRoutes(): void {
        this.router.post('/client/create-payment-intent',verifyAuth,authorizeRole(["client"]),(req : Request , res : Response)=> {
            
        })
    }
}