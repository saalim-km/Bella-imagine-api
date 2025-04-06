import { Request, Response } from "express";
import { LogoutController } from "../../../interfaceAdapters/controllers/auth/logout.controller";
import { authorizeRole, decodeToken, verifyAuth } from "../../../interfaceAdapters/middlewares/auth.middleware";
import { BaseRoute } from "../base.route";
import { getAllClientCategoriesController, getAllClientNotificatioController, getClientDetailsController, getPaginatedVendorsController, getPhotographerDetailsController, getServiceController, logoutController, refreshTokenController, updateClientController } from "../../di/resolver";

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

        this.router.route('/client/notification')
        .get(verifyAuth,authorizeRole(["client"]),(req : Request , res : Response)=> {
            getAllClientNotificatioController.handle(req,res)
        })

        this.router.route('/client/vendors')
        .get((req : Request , res : Response)=> {
            getPaginatedVendorsController.handle(req,res)
        })

        this.router.get('/client/categories',verifyAuth,authorizeRole(["client"]),(req : Request , res : Response)=> {
            getAllClientCategoriesController.handle(req,res)
        })

        this.router.get('/client/photographer/:id',verifyAuth,authorizeRole(["client"]),(req : Request , res : Response)=> {
            getPhotographerDetailsController.handle(req,res)
        })

        this.router.get('/client/service/:id',verifyAuth,authorizeRole(["client"]),(req : Request , res : Response)=> {
            getServiceController.handle(req,res)
        })

    }
}