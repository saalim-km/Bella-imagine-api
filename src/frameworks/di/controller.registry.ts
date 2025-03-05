import { container } from "tsyringe";
import { RegisterController } from "../../interfaceAdapters/controllers/auth/register.controller";
import { SendEmailController } from "../../interfaceAdapters/controllers/auth/send-email.controller";
import { VerifyOTPController } from "../../interfaceAdapters/controllers/auth/verify-otp.controller";

export class ControllerRegistry {
    static registerController() : void {
        container.register("RegisterController",{useClass : RegisterController});
        container.register("SendEmailController" , {useClass : SendEmailController});
        container.register("VerifyOTPController",{useClass : VerifyOTPController});
    }
}