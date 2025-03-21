import { container } from "tsyringe";
import { IRegisterUsecase } from "../../entities/usecaseInterfaces/auth/register-usecase.interface";
import { RegisterUsecase } from "../../useCases/auth/register-user.usecase";
import { IRegisterStrategy } from "../../useCases/auth/interfaces/register-strategy.interface";
import { ClientRegisterStrategy } from "../../useCases/auth/register-strategies/client-register.strategy";
import { IBcrypt } from "../security/bcrypt.interface";
import { PasswordBcrypt } from "../security/password.bcrypt";
import { OtpBcrypt } from "../security/otp.bcrypt.";
import { ISendEmailUseCase } from "../../entities/usecaseInterfaces/auth/send-email-usecase.interface";
import { SendEmailUseCase } from "../../useCases/auth/send-email.usecase";
import { IEmailService } from "../../entities/services/email-service.interface";
import { EmailService } from "../../interfaceAdapters/services/email.service";
import { IEmailExistenceService } from "../../entities/services/email-existence-service.interface";
import { EmailExistenceService } from "../../interfaceAdapters/services/email-existence.service";
import { IOtpService } from "../../entities/services/otp-service.interface";
import { OtpService } from "../../interfaceAdapters/services/otp.service";
import { IVerifyOTPUsecase } from "../../entities/usecaseInterfaces/auth/verify-otp-usecase.interface.";
import { VerifyOTPUsecase } from "../../useCases/auth/verfiy-otp.usecase";
import { VendorRegisterStrategy } from "../../useCases/auth/register-strategies/vendor-register.strategy";
import { IJwtservice } from "../../entities/services/jwt.service";
import { JwtService } from "../../interfaceAdapters/services/jwt.service";
import { IGenerateTokenUsecase } from "../../entities/usecaseInterfaces/auth/generate-token-usecase.interface";
import { GenerateTokenUsecase } from "../../useCases/auth/generate-token.usecase";
import { ILogUseCaseIninterface } from "../../entities/usecaseInterfaces/auth/login-usecase.interface";
import { LoginUseCase } from "../../useCases/auth/login-user.usecase";
import { ILoginStrategy } from "../../useCases/auth/interfaces/login-strategy.interface";
import { ClientLoginStrategy } from "../../useCases/auth/login-strategies/client-login.strategy";
import { VendorLoginStrategy } from "../../useCases/auth/login-strategies/vendor-login.strategy";
import { IRefreshTokenUsecase } from "../../entities/usecaseInterfaces/auth/refresh-token-usecase.interface";
import { RefreshTokenUsecase } from "../../useCases/auth/refresh-token.usercase";
import { IGoogleUseCase } from "../../entities/usecaseInterfaces/auth/google-login-usecase.interface";
import { GoogleLoginUsecase } from "../../useCases/auth/google-login.usecase";
import { ClientGoogleLoginStrategy } from "../../useCases/auth/login-strategies/client-google-login.strategy";
import { VendorGoogleLoginStrategy } from "../../useCases/auth/login-strategies/vendor-google-login.strategy";
import { IGetClientDetailsUsecase } from "../../entities/usecaseInterfaces/client/get-client-details-usecase.interface";
import { GetClientDetailsUsecase } from "../../useCases/client/get-client-details.usecase";
import { IGetVendorDetailsUsecase } from "../../entities/usecaseInterfaces/vendor/get-vendor-details-usecase.interaface";
import { GetVendorDetailUsecase } from "../../useCases/vendor/get-vendor-details.usecase";
import { AdminLoginStrategy } from "../../useCases/auth/login-strategies/admin-login.strategy";
import { IUpdateClientUsecase } from "../../entities/usecaseInterfaces/client/update-client-profile-usecase.interface";
import { UpdateClientUsecase } from "../../useCases/client/update-client-profile.usecase";
import { IUpdateVendorProfileUsecase } from "../../entities/usecaseInterfaces/vendor/update-vendor-profile-usecase.interface";
import { UpdateVendorUsecase } from "../../useCases/vendor/update-vendor-profile.usecase";
import { IGetAllClientUsecase } from "../../entities/usecaseInterfaces/admin/get-all-clients-usecase.interafce";
import { GetAllClientsUsecase } from "../../useCases/admin/get-all-clients.uscase";
import { IGetAllVendorsUsecase } from "../../entities/usecaseInterfaces/admin/get-all-vendors-usecase.interafce";
import { GetAllVendorsUsecase } from "../../useCases/admin/get-all-vendors.uscase";
import { IUpdateUserStatusUsecase } from "../../entities/usecaseInterfaces/admin/update-user-usecase.interface";
import { UpdateUserStatusUsecase } from "../../useCases/admin/update-user-status.usecase";
import { IForgotPassWordSendOtpUsecase } from "../../entities/usecaseInterfaces/auth/forgot-password-send-otp-usecase.interfac";
import { ForgotPasswordSendOtp } from "../../useCases/auth/forgot-password-send-otp.usecase";
import { IResetPasswordUsecase } from "../../entities/usecaseInterfaces/auth/reset-password-usecase.interface";
import { ResetPasswordUsecase } from "../../useCases/auth/reset-password-usecase";
import { IGetPendingVendorRequestUsecase } from "../../entities/usecaseInterfaces/admin/get-pending-vendor-request-usecase.interface";
import { GetPendingVendorRequestUsecase } from "../../useCases/admin/get-pending-vendor-request.usecase";
import { IUpdateVendorRequestUsecase } from "../../entities/usecaseInterfaces/admin/update-vendor-request-usecase.interface";
import { UpdateVendorRequestUsecase } from "../../useCases/admin/update-vendor-request.usecase";
import { ICreateNewCategoryUseCase } from "../../entities/usecaseInterfaces/admin/create-new-category-usecase.interface";
import { CreateNewCategoryUseCase } from "../../useCases/admin/create-new-category.usecase";
import { IGetAllPaginatedCategoryUseCase } from "../../entities/usecaseInterfaces/admin/get-all-paginated-category-usecase.interface";
import { GetAllPaginatedCategoryUseCase } from "../../useCases/admin/get-all-paginated-category.usecase";
import { IGetAllVendorCategoriesUsecase } from "../../entities/usecaseInterfaces/vendor/get-all-vendor-categories-usecase.interface";
import { GetAllVendorCategoriesUsecase } from "../../useCases/vendor/get-all-vendor-categories.usecase";
import { IUpdateCategoryUsecase } from "../../entities/usecaseInterfaces/admin/update-category-usecase.interface";
import { UpdateCategoryUsecase } from "../../useCases/admin/update-category.usecase";
import { IJoinCategoryRequestUsecase } from "../../entities/usecaseInterfaces/vendor/join-category-reqeust-usecase.interface";
import { JoinCategoryRequestUseCase } from "../../useCases/vendor/join-category-request.usecase";
import { IGetAllVendorNotificationUsecase } from "../../entities/usecaseInterfaces/vendor/get-all-vendor-notification-usecase.interface";
import { GetAllVendorNotificationUsecase } from "../../useCases/vendor/get-all-vendor-notification.usecase";
import { IGetAllClientNotificationUsecase } from "../../entities/usecaseInterfaces/client/get-all-notification-usecase.interface";
import { GetAllClientNotificationUsecase } from "../../useCases/client/get-all-client-notification.usecase";
import { IGetCategoryRequestUsecase } from "../../entities/usecaseInterfaces/admin/get-category-request-usecase.interface";
import { GetCategoryRequestUsecase } from "../../useCases/admin/get-category-request.usecase";
import { IUpdateCategoryRequestStatusUsecase } from "../../entities/usecaseInterfaces/admin/update-category-request-status-usecase.interface";
import { UpdateCategoryRequestStatusUsecase } from "../../useCases/admin/update-category-request-status.usecase";

export class UsecaseRegistry {
    static registerUsecase(): void {
        // |---------------------------------- Use Cases --------------------------------------------------|
        container.register<IRegisterUsecase>("IRegisterUsecase", { useClass: RegisterUsecase });
        container.register<ISendEmailUseCase>("ISendEmailUseCase", { useClass: SendEmailUseCase });
        container.register<IGenerateTokenUsecase>("IGenerateTokenUsecase", { useClass: GenerateTokenUsecase });
        container.register<ILogUseCaseIninterface>("ILogUseCaseIninterface", { useClass: LoginUseCase });
        container.register<IRefreshTokenUsecase>("IRefreshTokenUsecase", { useClass: RefreshTokenUsecase });
        container.register<IGoogleUseCase>("IGoogleUseCase", { useClass: GoogleLoginUsecase });

        container.register<IGetClientDetailsUsecase>("IGetClientDetailsUsecase", { useClass: GetClientDetailsUsecase });
        container.register<IGetVendorDetailsUsecase>("IGetVendorDetailsUsecase", { useClass: GetVendorDetailUsecase });
        container.register<IUpdateClientUsecase>("IUpdateClientUsecase", { useClass: UpdateClientUsecase });
        container.register<IUpdateVendorProfileUsecase>("IUpdateVendorProfileUsecase", { useClass: UpdateVendorUsecase });

        container.register<IForgotPassWordSendOtpUsecase>("IForgotPassWordSendOtpUsecase", { useClass: ForgotPasswordSendOtp });
        container.register<IResetPasswordUsecase>("IResetPasswordUsecase", { useClass: ResetPasswordUsecase });

        container.register<IGetPendingVendorRequestUsecase>("IGetPendingVendorRequestUsecase", { useClass: GetPendingVendorRequestUsecase });
        container.register<IUpdateVendorRequestUsecase>("IUpdateVendorRequestUsecase", { useClass: UpdateVendorRequestUsecase });

        // |---------------------------------- Authentication Strategies ----------------------------------|
        // * Register Strategies
        container.register<IRegisterStrategy>("ClientRegisterStrategy", { useClass: ClientRegisterStrategy });
        container.register<IRegisterStrategy>("VendorRegisterStrategy", { useClass: VendorRegisterStrategy });

        // * Login Strategies
        container.register<ILoginStrategy>("ClientLoginStrategy", { useClass: ClientLoginStrategy });
        container.register<ILoginStrategy>("VendorLoginStrategy", { useClass: VendorLoginStrategy });
        container.register<ILoginStrategy>("AdminLoginStrategy", { useClass: AdminLoginStrategy });
        container.register<ILoginStrategy>("ClientGoogleLoginStrategy", { useClass: ClientGoogleLoginStrategy });
        container.register<ILoginStrategy>("VendorGoogleLoginStrategy", { useClass: VendorGoogleLoginStrategy });

        // |---------------------------------- Services --------------------------------------------------|
        container.register<IEmailService>("IEmailService", { useClass: EmailService });
        container.register<IEmailExistenceService>("IEmailExistenceService", { useClass: EmailExistenceService });
        container.register<IOtpService>("IOtpService", { useClass: OtpService });
        container.register<IVerifyOTPUsecase>("IVerifyOTPUsecase", { useClass: VerifyOTPUsecase });

        container.register<IJwtservice>("IJwtservice", { useClass: JwtService });
        container.register<IBcrypt>("PasswordBcrypt", { useClass: PasswordBcrypt });
        container.register<IBcrypt>("OtpBcrypt", { useClass: OtpBcrypt });

        // |---------------------------------- User & Vendor Management ----------------------------------|
        container.register<IGetAllClientUsecase>("IGetAllClientUsecase", { useClass: GetAllClientsUsecase });
        container.register<IGetAllVendorsUsecase>("IGetAllVendorsUsecase", { useClass: GetAllVendorsUsecase });
        container.register<IUpdateUserStatusUsecase>("IUpdateUserStatusUsecase", { useClass: UpdateUserStatusUsecase });

        // |---------------------------------- Category Management --------------------------------------|
        container.register<ICreateNewCategoryUseCase>("ICreateNewCategoryUseCase", { useClass: CreateNewCategoryUseCase });
        container.register<IGetAllPaginatedCategoryUseCase>("IGetAllPaginatedCategoryUseCase", { useClass: GetAllPaginatedCategoryUseCase });
        container.register<IGetAllVendorCategoriesUsecase>("IGetAllVendorCategoriesUsecase", { useClass: GetAllVendorCategoriesUsecase });
        container.register<IUpdateCategoryUsecase>("IUpdateCategoryUsecase" , {useClass : UpdateCategoryUsecase})
        container.register<IJoinCategoryRequestUsecase>("IJoinCategoryRequestUseCase" , {useClass : JoinCategoryRequestUseCase});
        container.register<IGetCategoryRequestUsecase>("IGetCategoryRequestUsecase" , {useClass : GetCategoryRequestUsecase})
        container.register<IUpdateCategoryRequestStatusUsecase>("IUpdateCategoryRequestStatusUsecase",{useClass : UpdateCategoryRequestStatusUsecase})


        // |--------------------------------------------------------- Notification Management ---------------------------------------------------|
        container.register<IGetAllVendorNotificationUsecase>("IGetAllVendorNotificationUsecase" , {useClass : GetAllVendorNotificationUsecase});
        container.register<IGetAllClientNotificationUsecase>('IGetAllClientNotificationUsecase' ,{useClass : GetAllClientNotificationUsecase})
    }

}