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
import { UpdateClientController } from "../../interfaceAdapters/controllers/client/update-client-profile.controller";
import { UpdateVendorController } from "../../interfaceAdapters/controllers/vendor/updat-vendor-profile.controller";
import { GetAllClientsController } from "../../interfaceAdapters/controllers/admin/get-all-clients.controller";
import { GetAllVendorsController } from "../../interfaceAdapters/controllers/admin/get-all-vendor.controller";
import { UpdateUserStatusController } from "../../interfaceAdapters/controllers/admin/update-user-status.controller";
import { ForgotPasswordSendOtpController } from "../../interfaceAdapters/controllers/auth/forgot-password-send-otp.controller";
import { ResetPasswordController } from "../../interfaceAdapters/controllers/auth/reset-password.controller";
import { GetPendingVendorController } from "../../interfaceAdapters/controllers/admin/get-pending-vendor-request.controller";
import { UpdateVendorRequestController } from "../../interfaceAdapters/controllers/admin/update-vendor-request.controller";

DependencyInjection.registerAll();

// |==================== User Registration ==========================|
export const registerController = container.resolve(RegisterController);

// |========================= Email & OTP Verification ==================|
export const sendEmailController = container.resolve(SendEmailController);
export const veriryOtpController = container.resolve(VerifyOTPController);

// |========================== Authentication =============================|
export const loginController = container.resolve(LoginController);
export const logoutController = container.resolve(LogoutController);
export const refreshTokenController = container.resolve(RefreshTokenController);
export const googleLoginController = container.resolve(GoogleLoginController);

// |========================= Password Recovery =========================================|
export const forgotPasswordController = container.resolve(ForgotPasswordSendOtpController);
export const resetPasswordController = container.resolve(ResetPasswordController)

// |========================= Client Management ======================================|
export const getClientDetailsController = container.resolve(GetClientDetailsController);
export const updateClientController = container.resolve(UpdateClientController);
export const getAllClientController = container.resolve(GetAllClientsController);

// |=============================== Vendor Management ===============================|
export const getVendorDetialsController = container.resolve(GetVendorDetailsController);
export const updateVendorController = container.resolve(UpdateVendorController);
export const getAllVendorController = container.resolve(GetAllVendorsController);
export const getPendingVendorController = container.resolve(GetPendingVendorController);
export const updateVendorRequestController = container.resolve(UpdateVendorRequestController)

// |================================ User Status Management ==========================|
export const updateUserStatusController = container.resolve(UpdateUserStatusController);
