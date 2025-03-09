import { container } from "tsyringe";
import { RegisterController } from "../../interfaceAdapters/controllers/auth/register.controller";
import { SendEmailController } from "../../interfaceAdapters/controllers/auth/send-email.controller";
import { VerifyOTPController } from "../../interfaceAdapters/controllers/auth/verify-otp.controller";
import { LoginController } from "../../interfaceAdapters/controllers/auth/login.controller";
import { LogoutController } from "../../interfaceAdapters/controllers/auth/logout.controller";
import { RefreshTokenController } from "../../interfaceAdapters/controllers/auth/refresh-token.controller";
import { GoogleLoginController } from "../../interfaceAdapters/controllers/auth/google-login.controller";

export class ControllerRegistry {
    static registerController() : void {
        container.register("RegisterController",{useClass : RegisterController});
        container.register("SendEmailController" , {useClass : SendEmailController});
        container.register("VerifyOTPController",{useClass : VerifyOTPController});
        container.register("LoginController" , {useClass : LoginController})
        container.register("LogoutController", {useClass : LogoutController})
        container.register("RefreshTokenController" , {useClass : RefreshTokenController})
        container.register("GoogleLoginController" , {useClass : GoogleLoginController})
    }
}