import { Request, Response } from "express";
import { authorizeRole, decodeToken, verifyAuth } from "../../../interfaceAdapters/middlewares/auth.middleware";
import { BaseRoute } from "../base.route";
import { getAllVendorCategoriesController, getAllVendorNotificationController, getVendorDetialsController, joinCategoryRequestController, logoutController, refreshTokenController, updateVendorController } from "../../di/resolver";

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

        this.router.route('/vendor/details')
        .get(verifyAuth,authorizeRole(["vendor"]),(req : Request , res : Response)=> {
            getVendorDetialsController.handle(req,res)
        })
        .put(verifyAuth,authorizeRole(["vendor"]),(req : Request , res : Response)=> {
            updateVendorController.handle(req,res)
        })

        this.router.route('/vendor/notification')
        .get(verifyAuth,authorizeRole(["vendor"]),(req : Request , res : Response)=> {
            getAllVendorNotificationController.handle(req,res)
        })

        this.router.route('/vendor/categories')
        .get(verifyAuth,authorizeRole(["vendor"]),(req : Request , res : Response)=> {
            getAllVendorCategoriesController.handle(req,res)
        })

        this.router.post("/vendor/categories/join",verifyAuth,authorizeRole(["vendor"]),(req : Request,res : Response)=> {
            joinCategoryRequestController.handle(req,res)
        })
    }
}