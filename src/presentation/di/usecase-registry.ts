import { container } from "tsyringe";
import { EmailExistenceUsecase } from "../../application/auth/email-existence.usecase";
import {
    IForgotPasswordUsecase,
    IGenerateTokenUsecase,
    ILoginUserStrategy,
    IRegisterUserStrategy,
    IRegisterUserUsecase,
    IResetPasswordStrategy,
    IResetPasswordUsecase,
    ISendAuthEmailUsecase,
    IUserLoginUsecase,
    IVerifyOtpUsecase
} from "../../domain/interfaces/usecase/auth-usecase.interfaces";
import { SendAuthOtpEmailUsecase } from "../../application/auth/send-auth-otp.usecase";
import { RegisterUserUsecase } from "../../application/auth/register-user.usecase";
import { ClientRegisterStrategy } from "../../application/auth/strategies/register strategies/client-register.strategy";
import { VendorRegisterStrategy } from "../../application/auth/strategies/register strategies/vendor-register.strategy";
import { VerifyOtpUsecase } from "../../application/auth/verify-otp.usecase";
import { ClientLoginStrategy } from "../../application/auth/strategies/login strategies/client-login.strategy";
import { VendorLoginStrategy } from "../../application/auth/strategies/login strategies/vendor-login.strategy";
import { AdminLoginStrategy } from "../../application/auth/strategies/login strategies/admin-login.strategy";
import { LoginUserUsecase } from "../../application/auth/login-user.usecase";
import { GenerateTokenUsecase } from "../../application/auth/generate-token.usecase";
import { ForgotPasswordUsecase } from "../../application/auth/forgot-password.usecase";
import { ClientResetPasswordStrategy } from "../../application/auth/strategies/reset password/client-reset-password.usecase";
import { VendorResetPasswordStrategy } from "../../application/auth/strategies/reset password/vendor-reset-password.usecase";
import { ResetPasswordUsecase } from "../../application/auth/reset-password.usecase";

export class UsecaseRegistry {
    static registerUsecases(): void {
        // -------------------- Common Use Cases --------------------
        container.register('IEmailExistenceUsecase', {
            useClass: EmailExistenceUsecase
        });

        // -------------------- Auth Use Cases --------------------
        container.register<ISendAuthEmailUsecase>('ISendAuthEmailUsecase', {
            useClass: SendAuthOtpEmailUsecase
        });

        container.register<IRegisterUserUsecase>('IRegisterUserUsecase', {
            useClass: RegisterUserUsecase
        });

        container.register<IVerifyOtpUsecase>('IVerifyOtpUsecase', {
            useClass: VerifyOtpUsecase
        });

        container.register<IUserLoginUsecase>('IUserLoginUsecase',{
            useClass: LoginUserUsecase
        })

        // -------------------- Auth Strategies --------------------
        container.register<IRegisterUserStrategy>('ClientRegisterStrategy', {
            useClass: ClientRegisterStrategy
        });

        container.register<IRegisterUserStrategy>('VendorRegisterStrategy', {
            useClass: VendorRegisterStrategy
        });

        container.register<ILoginUserStrategy>('ClientLoginStrategy', {
            useClass: ClientLoginStrategy
        });

        container.register<ILoginUserStrategy>('VendorLoginStrategy', {
            useClass: VendorLoginStrategy
        });

        container.register<ILoginUserStrategy>('AdminLoginStrategy', {
            useClass: AdminLoginStrategy
        })


        container.register<IGenerateTokenUsecase>('IGenerateTokenUsecase',{
            useClass : GenerateTokenUsecase
        })

        container.register<IForgotPasswordUsecase>('IForgotPasswordUsecase',{
            useClass: ForgotPasswordUsecase
        })

        container.register<IResetPasswordUsecase>('IResetPasswordUsecase' , {
            useClass : ResetPasswordUsecase
        })

        container.register<IResetPasswordStrategy>('ClientResetPasswordStrategy',{
            useClass : ClientResetPasswordStrategy
        })

        container.register<IResetPasswordStrategy>('VendorResetPasswordStrategy',{
            useClass : VendorResetPasswordStrategy
        })
    }
}
