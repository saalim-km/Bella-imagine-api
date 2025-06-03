import { asyncHandler } from "../../../shared/utils/async-handler";
import { adminController } from "../../di/resolver";
import { authorizeRole, verifyAuth } from "../../middlewares/auth.middleware";
import { BaseRoute } from "../base.route";

export class AdminRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router
        .post('/admin/logout',verifyAuth,authorizeRole(['admin']),asyncHandler(adminController.logout.bind(adminController)))
    }
}