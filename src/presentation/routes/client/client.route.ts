import { asyncHandler } from "../../../shared/utils/async-handler";
import { clientController } from "../../di/resolver";
import { authorizeRole, decodeToken, verifyAuth } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";
import { BaseRoute } from "../base.route";

export class ClientRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router
        .post('/client/logout',verifyAuth,authorizeRole(['client']),asyncHandler(clientController.logout.bind(clientController)))
        .post('/client/refresh-token',decodeToken,authorizeRole(['client']),asyncHandler(clientController.refreshToken.bind(clientController)))
        .get('/client/vendors',verifyAuth,authorizeRole(['client']),asyncHandler(clientController.getVendors.bind(clientController)))
        .get('/client/categories',verifyAuth,authorizeRole(['client']),asyncHandler(clientController.getCategories.bind(clientController)))
        .get('/client/photographer/:vendorId',verifyAuth,authorizeRole(['client']),asyncHandler(clientController.getVendorDetails.bind(clientController)))
        .get('/client/service/:serviceId',verifyAuth,authorizeRole(['client']),asyncHandler(clientController.getServiceDetails.bind(clientController)))
        .post('/client/create-payment-intent',verifyAuth,authorizeRole(['client']),asyncHandler(clientController.createPaymentIntent.bind(clientController)))
        .post('/client/webhook',clientController.handleWebhook.bind(clientController))

        this.router.route('/client/details')
        .get(verifyAuth,authorizeRole(['client']),asyncHandler(clientController.getClientDetails.bind(clientController)))
        .put(verifyAuth,authorizeRole(['client']),upload.single("profileImage"),asyncHandler(clientController.updateClientDetails.bind(clientController)))
    }
}