import { container } from "tsyringe";
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

export class ControllerRegistry {
    static registerController() : void {
        // |-------------------------- Controller Registrations --------------------------|
        container.register("RegisterController", { useClass: RegisterController });

        // |-------------------------- Email & OTP Verification --------------------------|
        container.register("SendEmailController", { useClass: SendEmailController });
        container.register("VerifyOTPController", { useClass: VerifyOTPController });

        // |-------------------------- Authentication Controllers ------------------------|
        container.register("LoginController", { useClass: LoginController });
        container.register("LogoutController", { useClass: LogoutController });
        container.register("RefreshTokenController", { useClass: RefreshTokenController });
        container.register("GoogleLoginController", { useClass: GoogleLoginController });
        container.register("ForgotPasswordSendOtpController" , {useClass : ForgotPasswordSendOtpController})

        // |-------------------------- User Details Controllers --------------------------|
        container.register("GetClientDetailsController", { useClass: GetClientDetailsController });
        container.register("GetVendorDetailsController", { useClass: GetVendorDetailsController });

         // |-------------------------- User Update Controllers --------------------------|
        container.register('UpdateClientController',{useClass : UpdateClientController})
        container.register("UpdateVendorController" , {useClass : UpdateVendorController})


        container.register("GetAllClientsController" , {useClass : GetAllClientsController})
        container.register("GetAllVendorsController" , {useClass : GetAllVendorsController})
        container.register("UpdateUserStatusController" , {useClass : UpdateUserStatusController})
        container.register("ResetPasswordController" , {useClass : ResetPasswordController})


        container.register("GetPendingVendorController" , {useClass : GetPendingVendorController})
        container.register("UpdateVendorRequestController" , {useClass : UpdateVendorRequestController})
    }
}