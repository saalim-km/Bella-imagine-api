import { container } from "tsyringe";
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
import { IRefreshTokenUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { ICategoryManagementUsecase, IGetUserDetailsStrategy, IGetUserDetailsUsecase, IGetUsersStrategy, IGetUsersUsecase, IGetVendorRequestUsecase, IUserManagementUsecase } from "../../domain/interfaces/usecase/admin-usecase.interface";
import { GetUsersUsecase } from "../../application/admin/get-users.usecase";
import { GetClientsUsecase } from "../../application/admin/strategies/get-clients.strategy";
import { GetVendorsUsecase } from "../../application/admin/strategies/get-vendors.strategy";
import { GetuserDetailsUsecase } from "../../application/admin/get-user-details.usecase";
import { GetClientDetailsStrategy } from "../../application/admin/strategies/get-client-details.strategy";
import { GetVendorDetailsStrategy } from "../../application/admin/strategies/get-vendor-details.strategy";
import { GetVendorRequestUsecase } from "../../application/admin/get-vendor-requests.usecase";
import { RefreshTokenUsecase } from "../../application/common/refresh-token.usecase";
import { EmailExistenceUsecase } from "../../application/common/email-existence.usecase";
import { UserManagementUsecase } from "../../application/admin/user-management.usecase";
import { CategoryManagementUsecase } from "../../application/admin/category-management.usecase";
import { IBookingCommandUsecase, IVendorBrowsingUseCase } from "../../domain/interfaces/usecase/client-usecase.interface";
import { VendorBrowsingUsecase } from "../../application/client/vendor-browsing.usecase";
import { BookingCommandUsecase } from "../../application/client/booking-command.usecase";

export class UsecaseRegistry {
    // Static method to register all use cases and strategies
    static registerUsecases(): void {
        // Common Use Cases
        container.register('IEmailExistenceUsecase', {
            useClass: EmailExistenceUsecase
        });

        // Auth Use Cases
        container.register<ISendAuthEmailUsecase>('ISendAuthEmailUsecase', {
            useClass: SendAuthOtpEmailUsecase
        });
        container.register<IRegisterUserUsecase>('IRegisterUserUsecase', {
            useClass: RegisterUserUsecase
        });
        container.register<IVerifyOtpUsecase>('IVerifyOtpUsecase', {
            useClass: VerifyOtpUsecase
        });
        container.register<IUserLoginUsecase>('IUserLoginUsecase', {
            useClass: LoginUserUsecase
        });
        container.register<IGenerateTokenUsecase>('IGenerateTokenUsecase', {
            useClass: GenerateTokenUsecase
        });
        container.register<IForgotPasswordUsecase>('IForgotPasswordUsecase', {
            useClass: ForgotPasswordUsecase
        });
        container.register<IResetPasswordUsecase>('IResetPasswordUsecase', {
            useClass: ResetPasswordUsecase
        });
        container.register<IRefreshTokenUsecase>('IRefreshTokenUsecase', {
            useClass: RefreshTokenUsecase
        });

        // Auth Strategies
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
        });
        container.register<IResetPasswordStrategy>('ClientResetPasswordStrategy', {
            useClass: ClientResetPasswordStrategy
        });
        container.register<IResetPasswordStrategy>('VendorResetPasswordStrategy', {
            useClass: VendorResetPasswordStrategy
        });

        // Admin Use Cases
        container.register<IGetUsersUsecase>('IGetUsersUsecase', {
            useClass: GetUsersUsecase
        });
        container.register<IGetUsersStrategy>('GetClientsStrategy', {
            useClass: GetClientsUsecase
        });
        container.register<IGetUsersStrategy>('GetVendorsStrategy', {
            useClass: GetVendorsUsecase
        });
        container.register<IGetUserDetailsUsecase>('IGetUserDetailsUsecase', {
            useClass: GetuserDetailsUsecase
        });
        container.register<IGetUserDetailsStrategy>('GetClientDetailsStrategy', {
            useClass: GetClientDetailsStrategy
        });
        container.register<IGetUserDetailsStrategy>('GetVendorDetailsStrategy', {
            useClass: GetVendorDetailsStrategy
        });
        container.register<IGetVendorRequestUsecase>('IGetVendorRequestUsecase', {
            useClass: GetVendorRequestUsecase
        });
        container.register<IUserManagementUsecase>('IUserManagementUsecase',{
            useClass:  UserManagementUsecase
        })
        container.register<ICategoryManagementUsecase>('ICategoryManagementUsecase',{
            useClass : CategoryManagementUsecase
        })
        container.register<IVendorBrowsingUseCase>('IVendorBrowsingUseCase' , {
            useClass : VendorBrowsingUsecase
        })

        container.register<IBookingCommandUsecase>('IBookingCommandUsecase' , {
            useClass : BookingCommandUsecase
        })
    }
}