import { asyncHandler } from "../../../shared/utils/async-handler";
import { vendorController } from "../../di/resolver";
import { authorizeRole, decodeToken, verifyAuth } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";
import { BaseRoute } from "../base.route";

export class VendorRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router
        .post('/vendor/logout', verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.logout.bind(vendorController)))
        .post('/vendor/refresh-token' , decodeToken,authorizeRole(['vendor']) , asyncHandler(vendorController.refreshToken.bind(vendorController)))
        .get('/vendor/wallet', verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.fetchWallet.bind(vendorController)))
        this.router.route('/vendor/details')
        .get(verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.getVendorDetails.bind(vendorController)))
        .put(verifyAuth,authorizeRole(['vendor']),upload.fields([
          { name: "profileImage", maxCount: 1 },
          { name: "verificationDocument", maxCount: 1 },
        ]),asyncHandler(vendorController.updateVendorDetails.bind(vendorController)))


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

        this
        .router.route('/vendor/work-sample')
        .post(verifyAuth,authorizeRole(['vendor']),upload.fields([{name : 'media' , maxCount : 10}]),asyncHandler(vendorController.createWorkSample.bind(vendorController)))
    }
}