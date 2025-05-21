import { BaseRoute } from "../base-route";
import { ClientRoute } from "../client/client-route";

export class PrivateRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router.use('/_cl',new ClientRoute().router);
        this.router.use('/_ve',new ClientRoute().router);
        this.router.use('/_ad',new ClientRoute().router);
    }
}