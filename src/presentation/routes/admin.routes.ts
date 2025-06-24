import { asyncHandler } from "../../shared/utils/helper/async-handler";
import { adminController, communityController } from "../di/resolver";
import { authorizeRole, decodeToken, verifyAuth } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { BaseRoute } from "./base.route";

export class AdminRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router
        .post('/admin/logout',verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.logout.bind(adminController)))
        .post('/admin/refresh-token',decodeToken,asyncHandler(adminController.refreshToken.bind(adminController)))
        .get('/admin/users',verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.getUsers.bind(adminController)))
        .get('/admin/user',verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.getUserDetails.bind(adminController)))
        .patch('/admin/user-status',verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.updateBlockStatus.bind(adminController)))
        .get('/admin/community/:slug',verifyAuth,authorizeRole(['admin']),asyncHandler(communityController.fetchCommunityDetais.bind(communityController)))
        .get('/admin/community/members/:communityId',verifyAuth,authorizeRole(['admin']),asyncHandler(communityController.getCommunityMembers.bind(communityController)))
        .get('/admin/wallet',verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.getWallet.bind(adminController)))


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

        this.router.route('/admin/community')
        .post(verifyAuth,authorizeRole(['admin']),upload.fields([{name : 'iconImage' , maxCount : 1},{name : 'coverImage' , maxCount : 1}]),asyncHandler(communityController.createCommunity.bind(communityController)))
        .get(verifyAuth,authorizeRole(['admin']),asyncHandler(communityController.fetchAllCommunity.bind(communityController)))
        .put(verifyAuth,authorizeRole(['admin']),upload.fields([{name : 'iconImage' , maxCount : 1},{name : 'coverImage' , maxCount : 1}]),asyncHandler(communityController.updateCommunity.bind(communityController)))
    }
}