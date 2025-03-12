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
import { VendorRegisterStrategy } from "../../useCases/auth/register-strategies/vendor-register.strategy";
import { IJwtservice } from "../../entities/services/jwt.service";
import { JwtService } from "../../interfaceAdapters/services/jwt.service";
import { IGenerateTokenUsecase } from "../../entities/usecaseIntefaces/auth/generate-token-usecase.interface";
import { GenerateTokenUsecase } from "../../useCases/auth/generate-token.usecase";
import { ILogUseCaseIninterface } from "../../entities/usecaseIntefaces/auth/login-usecase.interface";
import { LoginUseCase } from "../../useCases/auth/login-user.usecase";
import { ILoginStrategy } from "../../useCases/auth/interfaces/login-strategy.interface";
import { ClientLoginStrategy } from "../../useCases/auth/login-strategies/client-login.strategy";
import { VendorLoginStrategy } from "../../useCases/auth/login-strategies/vendor-login.strategy";
import { IRefreshTokenUsecase } from "../../entities/usecaseIntefaces/auth/refresh-token-usecase.interface";
import { RefreshTokenUsecase } from "../../useCases/auth/refresh-token.usercase";
import { IGoogleUseCase } from "../../entities/usecaseIntefaces/auth/google-login-usecase.interface";
import { GoogleLoginUsecase } from "../../useCases/auth/google-login.usecase";
import { ClientGoogleLoginStrategy } from "../../useCases/auth/login-strategies/client-google-login.strategy";
import { VendorGoogleLoginStrategy } from "../../useCases/auth/login-strategies/vendor-google-login.strategy";
import { IGetClientDetailsUsecase } from "../../entities/usecaseIntefaces/client/get-client-details-usecase.interface";
import { GetClientDetailsUsecase } from "../../useCases/client/get-client-details.usecase";
import { IGetVendorDetailsUsecase } from "../../entities/usecaseIntefaces/vendor/get-vendor-details-usecase.interaface";
import { GetVendorDetailUsecase } from "../../useCases/vendor/get-vendor-details.usecase";
import { AdminLoginStrategy } from "../../useCases/auth/login-strategies/admin-login.strategy";

export class UsecaseRegistry {
    static registerUsecase(): void {
    //  |----------------------------------Usecases-----------------------------------------------------------|
        container.register<IRegisterUsecase>("IRegisterUsecase",{useClass : RegisterUsecase});
        container.register<ISendEmailUseCase>("ISendEmailUseCase" , {useClass : SendEmailUseCase});
        container.register<IGenerateTokenUsecase>("IGenerateTokenUsecase" , {useClass : GenerateTokenUsecase});
        container.register<ILogUseCaseIninterface>("ILogUseCaseIninterface", {useClass : LoginUseCase});  
        container.register<IRefreshTokenUsecase>("IRefreshTokenUsecase" , {useClass : RefreshTokenUsecase})
        container.register<IGoogleUseCase>("IGoogleUseCase" , {useClass : GoogleLoginUsecase});
        container.register<IGetClientDetailsUsecase>("IGetClientDetailsUsecase" , {useClass : GetClientDetailsUsecase})
        container.register<IGetVendorDetailsUsecase>("IGetVendorDetailsUsecase" , {useClass : GetVendorDetailUsecase})


        
    //  |----------------------------------Register Strategies----------------------------------------------|
        container.register<IRegisterStrategy>("ClientRegisterStrategy" , {useClass : ClientRegisterStrategy})
        container.register<IRegisterStrategy>("VendorRegisterStrategy" , {useClass : VendorRegisterStrategy})


    //  |----------------------------------Login Strategies----------------------------------------------------|
        container.register<ILoginStrategy>("ClientLoginStrategy" , {useClass: ClientLoginStrategy})
        container.register<ILoginStrategy>("VendorLoginStrategy" , {useClass: VendorLoginStrategy})
        container.register<ILoginStrategy>("AdminLoginStrategy" , {useClass : AdminLoginStrategy})
        container.register<ILoginStrategy>("ClientGoogleLoginStrategy" , {useClass : ClientGoogleLoginStrategy})
        container.register<ILoginStrategy>("VendorGoogleLoginStrategy" , {useClass : VendorGoogleLoginStrategy})


    //  |----------------------------------Services-----------------------------------------------------------|
        container.register<IEmailService>("IEmailService" , {useClass : EmailService})
        container.register<IEmailExistenceService>("IEmailExistenceService" ,{useClass: EmailExistenceService})
        container.register<IOtpService>("IOtpService" , {useClass : OtpService})
        container.register<IVerifyOTPUsecase>("IVerifyOTPUsecase",{useClass : VerifyOTPUsecase})
        container.register<IJwtservice>("IJwtservice" , {useClass : JwtService});
        container.register<IBcrypt>("IBcrypt" , {useClass : PasswordBcrypt})
        container.register<IBcrypt>("IBcrypt" , {useClass : OtpBcrypt})
    }

}