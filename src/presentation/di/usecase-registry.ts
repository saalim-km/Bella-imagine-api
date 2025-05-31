import { container } from "tsyringe";
import { IEmailExistenceUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { EmailExistenceUsecase } from "../../application/auth/email-existence.usecase";
import { IRegisterUserStrategy, IRegisterUserUsecase, ISendAuthEmailUsecase, IVerifyOtpUsecase } from "../../domain/interfaces/usecase/auth-usecase.interfaces";
import { SendAuthOtpEmailUsecase } from "../../application/auth/send-auth-otp.usecase";
import { RegisterUserUsecase } from "../../application/auth/register-user.usecase";
import { ClientRegisterStrategy } from "../../application/auth/strategies/register strategies/client-register.strategy";
import { VendorRegisterStrategy } from "../../application/auth/strategies/register strategies/vendor-register.strategy";
import { VerifyOtpUsecase } from "../../application/auth/verify-otp.usecase";

export class UsecaseRegistry {
    static registerUsecases(): void{
        container.register<IEmailExistenceUsecase>('IEmailExistenceUsecase',{
            useClass : EmailExistenceUsecase
        })

        container.register<ISendAuthEmailUsecase>('ISendAuthEmailUsecase',{
            useClass : SendAuthOtpEmailUsecase
        })

        container.register<IRegisterUserUsecase>('IRegisterUserUsecase',{
            useClass : RegisterUserUsecase
        })

        container.register<IRegisterUserStrategy>('ClientRegisterStrategy',{
            useClass : ClientRegisterStrategy
        })

        container.register<IRegisterUserStrategy>('VendorRegisterStrategy',{
            useClass : VendorRegisterStrategy
        })

        container.register<IVerifyOtpUsecase>('IVerifyOtpUsecase',{
            useClass : VerifyOtpUsecase
        })
    }
}