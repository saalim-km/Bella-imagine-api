import { Request, Response } from "express";
import { LogoutController } from "../../../interfaceAdapters/controllers/auth/logout.controller";
import { authorizeRole, decodeToken, verifyAuth } from "../../../interfaceAdapters/middlewares/auth.middleware";
import { BaseRoute } from "../base.route";
import { getClientDetailsController, logoutController, refreshTokenController, updateClientController } from "../../di/resolver";

export class ClientRoute extends BaseRoute {
    constructor() {
        super()
    }
    protected initializeRoutes(): void {
        this.router.post('/client/logout',verifyAuth,(req : Request , res : Response)=> {
            logoutController.handle(req,res)
        })

        this.router.post('/client/refresh-token',decodeToken,(req : Request , res : Response)=> {
            refreshTokenController.handle(req,res)
        })

        this.router
        .route('/client/details')
        .get(verifyAuth , authorizeRole(["client"]) , (req : Request , res : Response)=> {
            getClientDetailsController.handle(req,res)
        })
        .put(verifyAuth,authorizeRole(["client"]) , (req : Request , res : Response)=> {
            updateClientController.handle(req,res)
        })
    }
}