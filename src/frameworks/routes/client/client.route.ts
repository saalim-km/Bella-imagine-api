import { Request, Response } from "express";
import { LogoutController } from "../../../interfaceAdapters/controllers/auth/logout.controller";
import { decodeToken, verifyAuth } from "../../../interfaceAdapters/middlewares/auth.middleware";
import { BaseRoute } from "../base.route";
import { logoutController, refreshTokenController } from "../../di/resolver";

export class ClientRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router.post('/client/logout',verifyAuth,(req : Request , res : Response)=> {
            logoutController.handle(req,res)
        })

            
        this.router.post('/client/refresh-token',decodeToken,(req : Request , res : Response)=> {
            refreshTokenController.handle(req,res)
        })
    }
}