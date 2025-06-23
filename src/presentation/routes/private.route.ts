import { AdminRoute } from "./admin.routes";
import { BaseRoute } from "./base.route";
import { ClientRoute } from "./client.route";
import { VendorRoute } from "./vendor.route";

export class PrivateRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router.use('/_cl',new ClientRoute().router);
        this.router.use('/_ve',new VendorRoute().router);
        this.router.use('/_ad',new AdminRoute().router);
    }
}