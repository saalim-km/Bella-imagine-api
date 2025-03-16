import { Request, Response } from "express";
import { authorizeRole, decodeToken, verifyAuth } from "../../../interfaceAdapters/middlewares/auth.middleware";
import { BaseRoute } from "../base.route";
import { getAllClientController, getAllVendorController, logoutController, refreshTokenController, updateUserStatusController } from "../../di/resolver";

export class AdminRoute extends BaseRoute {
    constructor(){
        super()
    }

    protected initializeRoutes(): void {
        this.router.post('/admin/logout',verifyAuth,(req : Request , res : Response)=> {
            logoutController.handle(req,res)
        })

        this.router.post('/admin/refresh-token',decodeToken,(req : Request , res : Response)=> {
            refreshTokenController.handle(req,res)
        })

        this.router.route("/admin/client")
        .get(verifyAuth,authorizeRole(["admin"]),(req : Request , res : Response)=> {
            getAllClientController.handle(req,res)
        })

        this.router.route('/admin/vendor')
        .get(verifyAuth,authorizeRole(["admin"]) , (req : Request , res : Response)=> {
            getAllVendorController.handle(req,res)
        })

        this.router.patch('/admin/user-status',verifyAuth,authorizeRole(["admin"]),(req : Request , res : Response)=> {
            updateUserStatusController.handle(req,res)
        })

        this.router.get('/amdmin/vendor-pending',verifyAuth,authorizeRole(["admin"]),(req : Request , res : Response)=> {
            
        })
    }
}