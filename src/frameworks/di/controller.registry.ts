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

        // |-------------------------- User Details Controllers --------------------------|
        container.register("GetClientDetailsController", { useClass: GetClientDetailsController });
        container.register("GetVendorDetailsController", { useClass: GetVendorDetailsController });
    }
}