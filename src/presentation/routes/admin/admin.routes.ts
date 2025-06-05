import { asyncHandler } from "../../../shared/utils/async-handler";
import { adminController } from "../../di/resolver";
import { authorizeRole, verifyAuth } from "../../middlewares/auth.middleware";
import { BaseRoute } from "../base.route";

export class AdminRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router
        .post('/admin/logout',verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.logout.bind(adminController)))
        .post('/admin/refresh-token',verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.refreshToken.bind(adminController)))
        .get('/admin/users',verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.getUsers.bind(adminController)))
        .get('/admin/user',verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.getUserDetails.bind(adminController)))
        .get('/admin/vendor-request',verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.getVendoRequests.bind(adminController)))
        .patch('/admin/user-status',verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.updateBlockStatus.bind(adminController)))
    }
}