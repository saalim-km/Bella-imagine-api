import { asyncHandler } from "../../../shared/utils/async-handler";
import { clientController } from "../../di/resolver";
import { authorizeRole, decodeToken, verifyAuth } from "../../middlewares/auth.middleware";
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
    }
}