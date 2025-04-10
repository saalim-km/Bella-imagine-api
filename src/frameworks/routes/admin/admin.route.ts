import { Request, Response } from "express";
import { authorizeRole, decodeToken, verifyAuth } from "../../../interfaceAdapters/middlewares/auth.middleware";
import { BaseRoute } from "../base.route";
import { createNewCategoryController, getAllClientController, getAllPaginatedCategoryController, getAllTransactionByUserIdController, getAllVendorController, getCategoryRequestController, getPendingVendorController, getUserDetailsController, getWalletDetailsOfUserController, logoutController, refreshTokenController, updateCategoryController, updateCategoryRequestStatusController, updateUserStatusController, updateVendorRequestController } from "../../di/resolver";

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

        this.router.get('/admin/user/details',verifyAuth,authorizeRole(["admin"]),(req : Request, res: Response)=> {
            getUserDetailsController.handle(req,res)
        })


        this.router.patch('/admin/user-status',verifyAuth,authorizeRole(["admin"]),(req : Request , res : Response)=> {
            updateUserStatusController.handle(req,res)
        })

        this.router.route('/admin/vendor-request')
        .get(verifyAuth,authorizeRole(["admin"]),(req : Request , res : Response)=> {
            getPendingVendorController.handle(req,res)
        })
        .post(verifyAuth,authorizeRole(["admin"]) , (req : Request , res :Response)=> {
            updateVendorRequestController.handle(req,res)
        })


        this.router
        .route("/admin/categories")
        .get(
          verifyAuth,
          authorizeRole(["admin"]),
          (req: Request, res: Response) =>
            getAllPaginatedCategoryController.handle(req, res)
        )
        .post(
          verifyAuth,
          authorizeRole(["admin"]),
          (req: Request, res: Response) =>
            createNewCategoryController.handle(req, res)
        )
        .patch(verifyAuth,authorizeRole(["admin"]),(req:Request,res : Response)=> {
            updateCategoryController.handle(req,res)
        })

        this.router.route('/admin/category-request')
        .get(verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response) => {
            getCategoryRequestController.handle(req,res)
        })
        .patch(verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response) => {
            updateCategoryRequestStatusController.handle(req,res)
        });

        this.router.get('/admin/wallet',verifyAuth,authorizeRole(["admin"]),(req: Request, res: Response)=> {
            getWalletDetailsOfUserController.handle(req,res)
        })

        this.router.get('/admin/transactions',verifyAuth,authorizeRole(["admin"]),(req: Request, res: Response)=> {
            getAllTransactionByUserIdController.handle(req,res)
        })
    }
}