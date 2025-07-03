import { asyncHandler } from "../../shared/utils/helper/async-handler";
import { clientController, communityController, vendorController } from "../di/resolver";
import { authorizeRole, decodeToken, verifyAuth } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { BaseRoute } from "./base.route";

export class VendorRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router
        .post('/vendor/logout', verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.logout.bind(vendorController)))
        .post('/vendor/refresh-token' , decodeToken,asyncHandler(vendorController.refreshToken.bind(vendorController)))
        .get('/vendor/wallet', verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.fetchWallet.bind(vendorController)))
        .get('/vendor/vendors',verifyAuth,authorizeRole(['vendor']),asyncHandler(clientController.getVendors.bind(clientController)))
        .get('/vendor/service/:serviceId',verifyAuth,authorizeRole(['vendor']),asyncHandler(clientController.getServiceDetails.bind(clientController)))
        .get('/vendor/photographer/:vendorId',verifyAuth,authorizeRole(['vendor']),asyncHandler(clientController.getVendorDetails.bind(clientController)))
        .delete('/vendor/work-sample/:workSampleId',verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.deleteWorkSample.bind(vendorController)))
        .get('/vendor/community/:slug',verifyAuth,authorizeRole(['vendor']),asyncHandler(communityController.fetchCommunityDetais.bind(communityController)))
        .post('/vendor/community-join',verifyAuth,authorizeRole(['vendor']),asyncHandler(communityController.joinCommunity.bind(communityController)))
        .delete('/vendor/community-leave/:communityId',verifyAuth,authorizeRole(['vendor']),asyncHandler(communityController.leaveCommunity.bind(communityController)))
        .get('/vendor/post/:postId',verifyAuth,authorizeRole(['vendor']),asyncHandler(communityController.getPostDetails.bind(communityController)))
        .get('/vendor/community',verifyAuth,authorizeRole(['vendor']),asyncHandler(communityController.fetchAllCommunitiesForUser.bind(communityController)))
        .post('/vendor/conversation',verifyAuth,authorizeRole(['vendor']),asyncHandler(clientController.createConversation.bind(clientController)))
        .delete('/vendor/comment/:commentId',verifyAuth,authorizeRole(['vendor']),asyncHandler(communityController.deleteComment.bind(communityController)))
        .get('/vendor/post',verifyAuth,authorizeRole(['vendor']),asyncHandler(communityController.getAllPostForUser.bind(communityController)))

        this.router.route('/vendor/details')
        .get(verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.getVendorDetails.bind(vendorController)))
        .put(verifyAuth,authorizeRole(['vendor']),upload.fields([
          { name: "profileImage", maxCount: 1 },
          { name: "verificationDocument", maxCount: 1 },
        ]),asyncHandler(vendorController.updateVendorDetails.bind(vendorController)))


        this.router.route('/vendor/notification')
        .patch(verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.readAllNotifications.bind(vendorController)))
        .get(verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.getAllNotifications.bind(vendorController)))
        .delete(verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.deleteNotifications.bind(vendorController)))

        this.router.route('/vendor/vendor-bookings')
        .get(verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.getVendorBookings.bind(vendorController)))
        .patch(verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.updateBookingStatus.bind(vendorController)))

        this.router.route('/vendor/categories')
        .get(verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.getCategories.bind(vendorController)))
        .post(verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.joinCateoryRequest.bind(vendorController)))

        this.router.route('/vendor/service')
        .post(verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.createService.bind(vendorController)))
        .get(verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.getServices.bind(vendorController)))
        .put(verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.updateService.bind(vendorController)))

        this.router.route('/vendor/service/:serviceId').delete(verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.deleteService.bind(vendorController)))

        this
        .router.route('/vendor/work-sample')
        .post(verifyAuth,authorizeRole(['vendor']),upload.fields([{name : 'media' , maxCount : 10}]),asyncHandler(vendorController.createWorkSample.bind(vendorController)))
        .get(verifyAuth,authorizeRole(['vendor']),upload.fields([{name : 'media' , maxCount : 10}]),asyncHandler(vendorController.getWorkSamples.bind(vendorController)))
        .put(verifyAuth,authorizeRole(['vendor']),upload.fields([{name : 'newImages' , maxCount : 10}]),asyncHandler(vendorController.updateWorkSample.bind(vendorController)))


        this.router.route('/vendor/community-post')
        .post(verifyAuth,authorizeRole(['vendor']),upload.fields([{name : 'media' , maxCount : 4}]),asyncHandler(communityController.createPost.bind(communityController)))
        .get(verifyAuth,authorizeRole(['vendor']),asyncHandler(communityController.getAllPosts.bind(communityController)))

        this.router.route('/vendor/comment')
        .post(verifyAuth,authorizeRole(['vendor']),asyncHandler(communityController.addComment.bind(communityController)))
        .patch(verifyAuth,authorizeRole(['vendor']),asyncHandler(communityController.editComment.bind(communityController)))
        .get(verifyAuth,authorizeRole(['vendor']),asyncHandler(communityController.fetchComments.bind(communityController)))
    }
}