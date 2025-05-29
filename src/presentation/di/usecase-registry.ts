import { container } from "tsyringe";
import { IEmailExistenceUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { EmailExistenceUsecase } from "../../application/auth/email-existence.usecase";
import { ISendAuthEmailUsecase } from "../../domain/interfaces/usecase/auth-usecase.interfaces";
import { SendAuthOtpEmailUsecase } from "../../application/auth/send-auth-otp.usecase";

export class UsecaseRegistry {
    static registerUsecases(): void{
        container.register<IEmailExistenceUsecase>('IEmailExistenceUsecase',{
            useClass : EmailExistenceUsecase
        })

        container.register<ISendAuthEmailUsecase>('ISendAuthEmailUsecase',{
            useClass : SendAuthOtpEmailUsecase
        })
    }
}