import { asyncHandler } from "../../../shared/utils/async-handler";
import { vendorController } from "../../di/resolver";
import { authorizeRole, verifyAuth } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";
import { BaseRoute } from "../base.route";

export class VendorRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router
        .post('/vendor/logout', verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.logout.bind(vendorController)))
        .post('/vendor/refresh-token' , verifyAuth,authorizeRole(['vendor']) , asyncHandler(vendorController.refreshToken.bind(vendorController)))

        this.router.route('/vendor/details')
        .get(verifyAuth,authorizeRole(['vendor']),asyncHandler(vendorController.getVendorDetails.bind(vendorController)))
        .put(verifyAuth,authorizeRole(['vendor']),upload.fields([
          { name: "profileImage", maxCount: 1 },
          { name: "verificationDocument", maxCount: 1 },
        ]),asyncHandler(vendorController.updateVendorDetails.bind(vendorController)))
    }
}