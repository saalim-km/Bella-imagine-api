import { container } from "tsyringe";
import { DependencyInjection } from ".";
import { RegisterController } from "../../interfaceAdapters/controllers/auth/register.controller";
import { SendEmailController } from "../../interfaceAdapters/controllers/auth/send-email.controller";
import { VerifyOTPController } from "../../interfaceAdapters/controllers/auth/verify-otp.controller";

DependencyInjection.registerAll();

export const registerController = container.resolve(RegisterController)

export const sendEmailController = container.resolve(SendEmailController);

export const veriryOtpController = container.resolve(VerifyOTPController);