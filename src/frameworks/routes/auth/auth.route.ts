import { BaseRoute } from "../base.route";

import {
  forgotPasswordController,
  googleLoginController,
  loginController,
  registerController,
  resetPasswordController,
  sendEmailController,
  veriryOtpController,
} from "../../di/resolver";
import { asyncHandler } from "../../../shared/handler/async-handler.utils";

export class AuthRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.post(
      "/register",
      asyncHandler(registerController.handle.bind(registerController))
    );

    this.router.post(
      "/send-otp",
      asyncHandler(sendEmailController.handle.bind(sendEmailController))
    );

    this.router.post(
      "/verify-otp",
      asyncHandler(veriryOtpController.handle.bind(veriryOtpController))
    );

    this.router.post(
      "/login",
      asyncHandler(loginController.handle.bind(loginController))
    );

    this.router.post(
      "/google-auth",
      asyncHandler(googleLoginController.handle.bind(googleLoginController))
    );

    this.router.post(
      "/forgot-password/send-otp",
      asyncHandler(forgotPasswordController.handle.bind(forgotPasswordController))
    );

    this.router.post(
      "/reset-password",
      asyncHandler(resetPasswordController.handle.bind(resetPasswordController))
    );
  }
}
