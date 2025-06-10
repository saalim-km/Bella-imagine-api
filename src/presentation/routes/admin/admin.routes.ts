import { asyncHandler } from "../../../shared/utils/async-handler";
import { adminController } from "../../di/resolver";
import { authorizeRole, decodeToken, verifyAuth } from "../../middlewares/auth.middleware";
import { BaseRoute } from "../base.route";

export class AdminRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router
        .post('/admin/logout',verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.logout.bind(adminController)))
        .post('/admin/refresh-token',decodeToken,authorizeRole(['admin']),asyncHandler(adminController.refreshToken.bind(adminController)))
        .get('/admin/users',verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.getUsers.bind(adminController)))
        .get('/admin/user',verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.getUserDetails.bind(adminController)))
        .patch('/admin/user-status',verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.updateBlockStatus.bind(adminController)))

        this.router.route('/admin/vendor-request')
        .get(verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.getVendoRequests.bind(adminController)))
        .patch(verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.updateVendorRequest.bind(adminController)))

        this.router.route('/admin/categories')
        .post(verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.createNewCategory.bind(adminController)))
        .get(verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.getCategories.bind(adminController)))
        .patch(verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.updateCategoryStatus.bind(adminController)))
        .put(verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.updateCategory.bind(adminController)))

        this.router.route('/admin/category-request')
        .get(verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.getCatJoinRequests.bind(adminController)))
        .patch(verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.updateCatRequest.bind(adminController)))
    }
}