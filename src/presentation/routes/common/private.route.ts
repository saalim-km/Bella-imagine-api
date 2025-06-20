import { AdminRoute } from "../admin/admin.routes";
import { BaseRoute } from "../base.route";
import { ClientRoute } from "../client/client.route";
import { VendorRoute } from "../vendor/vendor.route";

export class PrivateRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router.use('/_cl',new ClientRoute().router);
        this.router.use('/_ve',new VendorRoute().router);
        this.router.use('/_ad',new AdminRoute().router);
    }
}