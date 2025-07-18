import { container } from "tsyringe";
import {
    IForgotPasswordUsecase,
    IGenerateTokenUsecase,
    IGoogleLoginUsecase,
    ILoginUserStrategy,
    ILogoutUseCases,
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
import { ICategoryManagementUsecase, IDashboardUsecase, IGetUserDetailsStrategy, IGetUserDetailsUsecase, IGetUsersStrategy, IGetUsersUsecase, IGetVendorRequestUsecase, IUserManagementUsecase } from "../../domain/interfaces/usecase/admin-usecase.interface";
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
import { IClientProfileUsecase, IVendorBrowsingUseCase } from "../../domain/interfaces/usecase/client-usecase.interface";
import { VendorBrowsingUsecase } from "../../application/client/vendor-browsing.usecase";
import { BookingCommandUsecase } from "../../application/booking/booking-command.usecase";
import { ClientProfileUsecase } from "../../application/client/client-profile.usecase";
import { IServiceCommandUsecase, IServiceQueryUsecase, IVendorProfileUsecase } from "../../domain/interfaces/usecase/vendor-usecase.interface";
import { VendorProfileUsecase } from "../../application/vendor/vendor-profile.usecase";
import { BookingQueryUsecase } from "../../application/booking/booking-query.usecase";
import { IWalletUsecase } from "../../domain/interfaces/usecase/wallet-usecase.interface";
import { WalletUsecase } from "../../application/wallet/wallet.usecase";
import { IBookingCommandUsecase, IBookingQueryUsecase } from "../../domain/interfaces/usecase/booking-usecase.interface";
import { IPaymentUsecaase } from "../../domain/interfaces/usecase/payment.usecase";
import { PaymentUsecase } from "../../application/payment/payment.usecase";
import { ICommunityCommandUsecase, ICommunityPostCommandUsecase, ICommunityPostQueryUsecase, ICommunityQueryUsecase } from "../../domain/interfaces/usecase/community-usecase.interface";
import { CommunityCommandUsecase } from "../../application/community/community-command.usecase";
import { CommunityQueryUsecase } from "../../application/community/community-query.usecase";
import { IChatUsecase } from "../../domain/interfaces/usecase/chat-usecase.interface";
import { GoogleLoginUsecase } from "../../application/auth/google-login.usecase";
import { ServiceCommandUsecase } from "../../application/service/service-command.usecase";
import { ServiceQueryUsecase } from "../../application/service/service-query.usecase";
import { ChatUsecase } from "../../application/chat/chat.usecase";
import { INotificationUsecase } from "../../domain/interfaces/usecase/notification-usecase.interface";
import { NotifiactionUsecase } from "../../application/common/notification.usecase";
import { CommunityPostCommandUsecase } from "../../application/community/community-post-command.usecase";
import { CommunityPostQueryUsecase } from "../../application/community/community-post-query.usecase";
import { DashBoardUsecase } from "../../application/admin/dashboard.usecase";
import { LogoutUseCase } from "../../application/auth/logout.usecase";

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

        container.register<IClientProfileUsecase>('IClientProfileUsecase' , {
            useClass : ClientProfileUsecase
        })

        container.register<IVendorProfileUsecase>('IVendorProfileUsecase' , {
            useClass : VendorProfileUsecase
        })

        container.register<IBookingQueryUsecase>('IBookingQueryUsecase' , {
            useClass : BookingQueryUsecase
        })

        container.register<IWalletUsecase>('IWalletUsecase' , {
            useClass : WalletUsecase
        })

        container.register<IPaymentUsecaase>('IPaymentUsecaase' , {
            useClass : PaymentUsecase
        })

        container.register<ICommunityCommandUsecase>('ICommunityCommandUsecase' , {
            useClass : CommunityCommandUsecase
        })

        container.register<ICommunityQueryUsecase>('ICommunityQueryUsecase',{
            useClass : CommunityQueryUsecase
        })

        container.register<IChatUsecase>('IChatUsecase' , {
            useClass : ChatUsecase
        })

        container.register<IGoogleLoginUsecase>('IGoogleLoginUsecase', {
            useClass : GoogleLoginUsecase
        })

        container.register<IServiceCommandUsecase>('IServiceCommandUsecase',{
            useClass : ServiceCommandUsecase
        })

        container.register<IServiceQueryUsecase>('IServiceQueryUsecase' ,{
            useClass : ServiceQueryUsecase
        })

        container.register<INotificationUsecase>('INotificationUsecase' , {
            useClass : NotifiactionUsecase
        })

        container.register<ICommunityPostCommandUsecase>('ICommunityPostCommandUsecase',{
            useClass : CommunityPostCommandUsecase
        })

        container.register<ICommunityPostQueryUsecase>('ICommunityPostQueryUsecase' , {
            useClass : CommunityPostQueryUsecase
        })

        container.register<IDashboardUsecase>('IDashboardUsecase' , {
            useClass : DashBoardUsecase
        })

        container.register<ILogoutUseCases>('ILogoutUseCases',{
            useClass : LogoutUseCase
        })
    }
}