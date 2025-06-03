import { asyncHandler } from "../../../shared/utils/async-handler";
import { authController } from "../../di/resolver";
import { registrationRateLimit , authRateLimit , passwordResetRateLimit} from "../../middlewares/rate-limit.middleware";
import { BaseRoute } from "../base.route";

export class AuthRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router
        .post('/register',registrationRateLimit,asyncHandler(authController.register.bind(authController)))
        .post('/send-otp',registrationRateLimit,asyncHandler(authController.sendOtp.bind(authController)))
        .post('/verify-otp',registrationRateLimit,asyncHandler(authController.verifyOtp.bind(authController)))
        .post('/login',authRateLimit,asyncHandler(authController.login.bind(authController)));

        this.router.route('/forgot-password')
        .post(passwordResetRateLimit , asyncHandler(authController.forgotPassword.bind(authController)))
        .patch(passwordResetRateLimit ,asyncHandler(authController.resetPassword.bind(authController)))
    }
}