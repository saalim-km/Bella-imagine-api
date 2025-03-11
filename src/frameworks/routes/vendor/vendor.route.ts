import { Request, Response } from "express";
import { authorizeRole, decodeToken, verifyAuth } from "../../../interfaceAdapters/middlewares/auth.middleware";
import { BaseRoute } from "../base.route";
import { getVendorDetialsController, logoutController, refreshTokenController } from "../../di/resolver";

export class VendorRoute extends BaseRoute {
    constructor() {
        super()
    }
    protected initializeRoutes(): void {

        this.router.post('/vendor/logout',verifyAuth,(req : Request , res : Response)=> {
            logoutController.handle(req,res)
        })

        this.router.post('/vendor/refresh-token',decodeToken,(req : Request , res : Response)=> {
            refreshTokenController.handle(req,res);
        })

        this.router.get('/vendor/details',verifyAuth,authorizeRole(["vendor"]),(req : Request , res : Response)=> {
            getVendorDetialsController.handle(req,res)
        })


    }
}