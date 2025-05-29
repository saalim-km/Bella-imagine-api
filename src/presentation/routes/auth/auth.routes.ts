import { asyncHandler } from "../../../shared/utils/async-handler";
import { authController } from "../../di/resolver";
import { BaseRoute } from "../base.route";

export class AuthRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router
        .post('/register')
        .post('/send-otp',asyncHandler(authController.sendOtp.bind(authController)))
    }
}