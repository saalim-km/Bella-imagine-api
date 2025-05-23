import { BaseRoute } from "../base-route";

export class AuthRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router
        .post('/send-otp')
        .post('/register')
    }
}