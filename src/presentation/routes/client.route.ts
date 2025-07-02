import { asyncHandler } from "../../shared/utils/helper/async-handler";
import { clientController, communityController } from "../di/resolver";
import { authorizeRole, decodeToken, verifyAuth } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { BaseRoute } from "./base.route";

export class ClientRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router
        .post('/client/logout',verifyAuth,authorizeRole(['client']),asyncHandler(clientController.logout.bind(clientController)))
        .post('/client/refresh-token',decodeToken,asyncHandler(clientController.refreshToken.bind(clientController)))
        .get('/client/vendors',verifyAuth,authorizeRole(['client']),asyncHandler(clientController.getVendors.bind(clientController)))
        .get('/client/categories',verifyAuth,authorizeRole(['client']),asyncHandler(clientController.getCategories.bind(clientController)))
        .get('/client/photographer/:vendorId',verifyAuth,authorizeRole(['client']),asyncHandler(clientController.getVendorDetails.bind(clientController)))
        .get('/client/service/:serviceId',verifyAuth,authorizeRole(['client']),asyncHandler(clientController.getServiceDetails.bind(clientController)))
        .post('/client/create-payment-intent',verifyAuth,authorizeRole(['client']),asyncHandler(clientController.createPaymentIntent.bind(clientController)))
        .post('/client/webhook',clientController.handleWebhook.bind(clientController))
        .get('/client/wallet',verifyAuth,authorizeRole(['client']),asyncHandler(clientController.fetchWallet.bind(clientController)))
        .get('/client/community/:slug',verifyAuth,authorizeRole(['client']),asyncHandler(communityController.fetchCommunityDetais.bind(communityController)))
        .post('/client/community-join',verifyAuth,authorizeRole(['client']),asyncHandler(communityController.joinCommunity.bind(communityController)))
        .delete('/client/community-leave/:communityId',verifyAuth,authorizeRole(['client']),asyncHandler(communityController.leaveCommunity.bind(communityController)))
        .get('/client/post/:postId',verifyAuth,authorizeRole(['client']),asyncHandler(communityController.getPostDetails.bind(communityController)))
        .post('/client/conversation',verifyAuth,authorizeRole(['client']),asyncHandler(clientController.createConversation.bind(clientController)))

        this.router.route('/client/notification')
        .patch(verifyAuth,authorizeRole(['client']),asyncHandler(clientController.readAllNotifications.bind(clientController)))
        .get(verifyAuth,authorizeRole(['client']),asyncHandler(clientController.getAllNotifications.bind(clientController)))
        .delete(verifyAuth,authorizeRole(['client']),asyncHandler(clientController.deleteNotifications.bind(clientController)))
        
        this.router.route('/client/details')
        .get(verifyAuth,authorizeRole(['client']),asyncHandler(clientController.getClientDetails.bind(clientController)))
        .put(verifyAuth,authorizeRole(['client']),upload.single("profileImage"),asyncHandler(clientController.updateClientDetails.bind(clientController)))

        this.router.route('/client/client-bookings')
        .get(verifyAuth,authorizeRole(['client']),asyncHandler(clientController.getallBookings.bind(clientController)))
        .patch(verifyAuth,authorizeRole(['client']),asyncHandler(clientController.updateBookingStatus.bind(clientController)))

        this.router.route('/client/community')
        .get(verifyAuth,authorizeRole(['client']),asyncHandler(communityController.fetchAllCommunitiesForUser.bind(communityController)))

        this.router.route('/client/community-post')
        .post(verifyAuth,authorizeRole(['client']),upload.fields([{name : 'media' , maxCount : 4}]),asyncHandler(communityController.createPost.bind(communityController)))
        .get(verifyAuth,authorizeRole(['client']),asyncHandler(communityController.getAllPosts.bind(communityController)))

        this.router.route('/client/comment')
        .post(verifyAuth,authorizeRole(['client']),asyncHandler(communityController.addComment.bind(communityController)))
        .get(verifyAuth,authorizeRole(['client']),asyncHandler(communityController.fetchComments.bind(communityController)))
    }
}