import { container } from "tsyringe";
import { IRegisterUsecase } from "../../entities/usecaseIntefaces/auth/register-usecase.interface";
import { RegisterUsecase } from "../../useCases/auth/register-user.usecase";
import { IRegisterStrategy } from "../../useCases/auth/interfaces/register-strategy.interface";
import { ClientRegisterStrategy } from "../../useCases/auth/register-strategies/client-register.strategy";
import { IBcrypt } from "../security/bcrypt.interface";
import { PasswordBcrypt } from "../security/password.bcrypt";
import { OtpBcrypt } from "../security/otp.bcrypt.";
import { ISendEmailUseCase } from "../../entities/usecaseIntefaces/auth/send-email-usecase.interface";
import { SendEmailUseCase } from "../../useCases/auth/send-email.usecase";
import { IEmailService } from "../../entities/services/email-service.interface";
import { EmailService } from "../../interfaceAdapters/services/email.service";
import { IEmailExistenceService } from "../../entities/services/email-existence-service.interface";
import { EmailExistenceService } from "../../interfaceAdapters/services/email-existence.service";
import { IOtpService } from "../../entities/services/otp-service.interface";
import { OtpService } from "../../interfaceAdapters/services/otp.service";
import { IVerifyOTPUsecase } from "../../entities/usecaseIntefaces/auth/verify-otp-usecase.interface.";
import { VerifyOTPUsecase } from "../../useCases/auth/verfiy-otp.usecase";

export class UsecaseRegistry {
    static registerUsecase(): void {
        container.register<IRegisterUsecase>("IRegisterUsecase",{useClass : RegisterUsecase})
        container.register<ISendEmailUseCase>("ISendEmailUseCase" , {useClass : SendEmailUseCase})


        //Register strategies 
        container.register<IRegisterStrategy>("IRegisterStrategy" , {useClass : ClientRegisterStrategy})
        container.register<IEmailService>("IEmailService" , {useClass : EmailService})
        container.register<IEmailExistenceService>("IEmailExistenceService" ,{useClass: EmailExistenceService})
        container.register<IOtpService>("IOtpService" , {useClass : OtpService})
        container.register<IVerifyOTPUsecase>("IVerifyOTPUsecase",{useClass : VerifyOTPUsecase})


        // Bcrypt service 
        container.register<IBcrypt>("IBcrypt" , {useClass : PasswordBcrypt})
        container.register<IBcrypt>("IBcrypt" , {useClass : OtpBcrypt})
    }

}