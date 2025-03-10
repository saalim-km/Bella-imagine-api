import { container } from "tsyringe";
import { DependencyInjection } from ".";
import { RegisterController } from "../../interfaceAdapters/controllers/auth/register.controller";
import { SendEmailController } from "../../interfaceAdapters/controllers/auth/send-email.controller";
import { VerifyOTPController } from "../../interfaceAdapters/controllers/auth/verify-otp.controller";
import { LoginController } from "../../interfaceAdapters/controllers/auth/login.controller";
import { LogoutController } from "../../interfaceAdapters/controllers/auth/logout.controller";
import { RefreshTokenController } from "../../interfaceAdapters/controllers/auth/refresh-token.controller";
import { GoogleLoginController } from "../../interfaceAdapters/controllers/auth/google-login.controller";
import { GetClientDetailsController } from "../../interfaceAdapters/controllers/client/get-client-details.controller";
import { GetVendorDetailsController } from "../../interfaceAdapters/controllers/vendor/get-vendor-details-controller";

DependencyInjection.registerAll();

// |-------------------------- Register --------------------------------|
export const registerController = container.resolve(RegisterController);

// |-------------------------- Email & OTP Verification --------------------|
export const sendEmailController = container.resolve(SendEmailController);
export const veriryOtpController = container.resolve(VerifyOTPController);

// |-------------------------- Authentication ------------------------------|
export const loginController = container.resolve(LoginController);
export const logoutController = container.resolve(LogoutController);
export const refreshTokenController = container.resolve(RefreshTokenController);
export const googleLoginController = container.resolve(GoogleLoginController);

// |-------------------------- Get Client Details ------------------------------------|
export const getClientDetailsController = container.resolve(GetClientDetailsController);

// |-------------------------- Get Vendor Details -------------------------------------|
export const getVendorDetialsController = container.resolve(GetVendorDetailsController);
