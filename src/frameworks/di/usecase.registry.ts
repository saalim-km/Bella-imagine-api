import { container } from "tsyringe";

// Auth Use Cases
import { IRegisterUsecase } from "../../entities/usecaseInterfaces/auth/register-usecase.interface";
import { RegisterUsecase } from "../../useCases/auth/register-user.usecase";
import { ISendEmailUseCase } from "../../entities/usecaseInterfaces/auth/send-email-usecase.interface";
import { SendEmailUseCase } from "../../useCases/auth/send-email.usecase";
import { IVerifyOTPUsecase } from "../../entities/usecaseInterfaces/auth/verify-otp-usecase.interface.";
import { VerifyOTPUsecase } from "../../useCases/auth/verfiy-otp.usecase";
import { IGenerateTokenUsecase } from "../../entities/usecaseInterfaces/auth/generate-token-usecase.interface";
import { GenerateTokenUsecase } from "../../useCases/auth/generate-token.usecase";
import { ILogUseCaseIninterface } from "../../entities/usecaseInterfaces/auth/login-usecase.interface";
import { LoginUseCase } from "../../useCases/auth/login-user.usecase";
import { IRefreshTokenUsecase } from "../../entities/usecaseInterfaces/auth/refresh-token-usecase.interface";
import { RefreshTokenUsecase } from "../../useCases/auth/refresh-token.usercase";
import { IGoogleUseCase } from "../../entities/usecaseInterfaces/auth/google-login-usecase.interface";
import { GoogleLoginUsecase } from "../../useCases/auth/google-login.usecase";
import { IForgotPassWordSendOtpUsecase } from "../../entities/usecaseInterfaces/auth/forgot-password-send-otp-usecase.interfac";
import { ForgotPasswordSendOtp } from "../../useCases/auth/forgot-password-send-otp.usecase";
import { IResetPasswordUsecase } from "../../entities/usecaseInterfaces/auth/reset-password-usecase.interface";
import { ResetPasswordUsecase } from "../../useCases/auth/reset-password-usecase";

// Auth Strategies
import { IRegisterStrategy } from "../../useCases/auth/interfaces/register-strategy.interface";
import { ClientRegisterStrategy } from "../../useCases/auth/register-strategies/client-register.strategy";
import { VendorRegisterStrategy } from "../../useCases/auth/register-strategies/vendor-register.strategy";
import { ILoginStrategy } from "../../useCases/auth/interfaces/login-strategy.interface";
import { ClientLoginStrategy } from "../../useCases/auth/login-strategies/client-login.strategy";
import { VendorLoginStrategy } from "../../useCases/auth/login-strategies/vendor-login.strategy";
import { AdminLoginStrategy } from "../../useCases/auth/login-strategies/admin-login.strategy";
import { ClientGoogleLoginStrategy } from "../../useCases/auth/login-strategies/client-google-login.strategy";
import { VendorGoogleLoginStrategy } from "../../useCases/auth/login-strategies/vendor-google-login.strategy";

// Security Services
import { IBcrypt } from "../security/bcrypt.interface";
import { PasswordBcrypt } from "../security/password.bcrypt";
import { OtpBcrypt } from "../security/otp.bcrypt.";
import { IJwtservice } from "../../entities/services/jwt.service";
import { JwtService } from "../../interfaceAdapters/services/jwt.service";

// Email and OTP Services
import { IEmailService } from "../../entities/services/email-service.interface";
import { EmailService } from "../../interfaceAdapters/services/email.service";
import { IEmailExistenceService } from "../../entities/services/email-existence-service.interface";
import { EmailExistenceService } from "../../interfaceAdapters/services/email-existence.service";
import { IOtpService } from "../../entities/services/otp-service.interface";
import { OtpService } from "../../interfaceAdapters/services/otp.service";

// Client Use Cases
import { IGetClientDetailsUsecase } from "../../entities/usecaseInterfaces/client/get-client-details-usecase.interface";
import { GetClientDetailsUsecase } from "../../useCases/client/get-client-details.usecase";
import { IUpdateClientUsecase } from "../../entities/usecaseInterfaces/client/update-client-profile-usecase.interface";
import { UpdateClientUsecase } from "../../useCases/client/update-client-profile.usecase";
import { IGetAllPaginatedVendorsUsecase } from "../../entities/usecaseInterfaces/client/get-all-paginated-vendors-usecase-interface";
import { GetAllPaginatedVendorsUsecase } from "../../useCases/client/get-all-paginated-vendors.usecase";
import { IGetAllClientCategoriesUsecase } from "../../entities/usecaseInterfaces/client/get-all-client-categories-usecase.interface";
import { GetAllClientCategoriesUsecase } from "../../useCases/client/get-all-client-categories.usecase";
import { IGetPhotographerDetailsUsecase } from "../../entities/usecaseInterfaces/client/get-photographer-details-usecase.interface";
import { GetPhotographerDetailsUsecase } from "../../useCases/client/get-photographer-details.usecase";
import { IGetServiceUsecase } from "../../entities/usecaseInterfaces/client/get-service-usecase.interaface";
import { GetServiceUsecase } from "../../useCases/client/get-service.usecase";
import { IGetAllClientNotificationUsecase } from "../../entities/usecaseInterfaces/client/get-all-notification-usecase.interface";
import { GetAllClientNotificationUsecase } from "../../useCases/client/get-all-client-notification.usecase";

// Vendor Use Cases
import { IGetVendorDetailsUsecase } from "../../entities/usecaseInterfaces/vendor/get-vendor-details-usecase.interaface";
import { GetVendorDetailUsecase } from "../../useCases/vendor/get-vendor-details.usecase";
import { IUpdateVendorProfileUsecase } from "../../entities/usecaseInterfaces/vendor/update-vendor-profile-usecase.interface";
import { UpdateVendorUsecase } from "../../useCases/vendor/update-vendor-profile.usecase";
import { IGetAllVendorCategoriesUsecase } from "../../entities/usecaseInterfaces/vendor/get-all-vendor-categories-usecase.interface";
import { GetAllVendorCategoriesUsecase } from "../../useCases/vendor/get-all-vendor-categories.usecase";
import { IJoinCategoryRequestUsecase } from "../../entities/usecaseInterfaces/vendor/join-category-reqeust-usecase.interface";
import { JoinCategoryRequestUseCase } from "../../useCases/vendor/join-category-request.usecase";
import { IGetAllVendorNotificationUsecase } from "../../entities/usecaseInterfaces/vendor/get-all-vendor-notification-usecase.interface";
import { GetAllVendorNotificationUsecase } from "../../useCases/vendor/get-all-vendor-notification.usecase";
import { ICreateWorkSampleUsecase } from "../../entities/usecaseInterfaces/vendor/create-work-sample-usecase.interface";
import { CreateWorkSampleUsecase } from "../../useCases/work-sample/create-work-sample.usecase";
import { IGetPaginatedWorkSampleUsecase } from "../../entities/usecaseInterfaces/vendor/get-paginated-work-sample-usecase.interface";
import { GetAllPaginatedWorkSamplesUsecase } from "../../useCases/work-sample/get-paginated-work-sample.usecase";
import { IDeleteWorkSampleUsecase } from "../../entities/usecaseInterfaces/vendor/delete-work-sample-usecase.interface";
import { DeleteWorkSampleUsecase } from "../../useCases/work-sample/delete-work-sample.usecase";
import { IUpdateWorkSampleUsecase } from "../../entities/usecaseInterfaces/vendor/update-work-sample-usecase.interface";
import { UpdateWorkSampleUsecase } from "../../useCases/work-sample/update-work-sample.usecase";

// Admin Use Cases
import { IGetAllClientUsecase } from "../../entities/usecaseInterfaces/admin/users/get-all-clients-usecase.interafce";
import { GetAllClientsUsecase } from "../../useCases/admin/users/get-all-clients.uscase";
import { IGetAllVendorsUsecase } from "../../entities/usecaseInterfaces/admin/users/get-all-vendors-usecase.interafce";
import { GetAllVendorsUsecase } from "../../useCases/admin/users/get-all-vendors.uscase";
import { IUpdateUserStatusUsecase } from "../../entities/usecaseInterfaces/admin/users/update-user-usecase.interface";
import { UpdateUserStatusUsecase } from "../../useCases/admin/users/update-user-status.usecase";
import { IGetPendingVendorRequestUsecase } from "../../entities/usecaseInterfaces/admin/vendor_request/get-pending-vendor-request-usecase.interface";
import { GetPendingVendorRequestUsecase } from "../../useCases/admin/vendor_request/get-pending-vendor-request.usecase";
import { IUpdateVendorRequestUsecase } from "../../entities/usecaseInterfaces/admin/vendor_request/update-vendor-request-usecase.interface";
import { UpdateVendorRequestUsecase } from "../../useCases/admin/vendor_request/update-vendor-request.usecase";
import { ICreateNewCategoryUseCase } from "../../entities/usecaseInterfaces/admin/category/create-new-category-usecase.interface";
import { CreateNewCategoryUseCase } from "../../useCases/admin/category/create-new-category.usecase";
import { IGetAllPaginatedCategoryUseCase } from "../../entities/usecaseInterfaces/admin/category/get-all-paginated-category-usecase.interface";
import { GetAllPaginatedCategoryUseCase } from "../../useCases/admin/category/get-all-paginated-category.usecase";
import { IUpdateCategoryUsecase } from "../../entities/usecaseInterfaces/admin/category/update-category-usecase.interface";
import { UpdateCategoryUsecase } from "../../useCases/admin/category/update-category.usecase";
import { IGetCategoryRequestUsecase } from "../../entities/usecaseInterfaces/admin/category/get-category-request-usecase.interface";
import { GetCategoryRequestUsecase } from "../../useCases/admin/category/get-category-request.usecase";
import { IUpdateCategoryRequestStatusUsecase } from "../../entities/usecaseInterfaces/admin/category/update-category-request-status-usecase.interface";
import { UpdateCategoryRequestStatusUsecase } from "../../useCases/admin/category/update-category-request-status.usecase";
import { IGetUserDetailsUsecase } from "../../entities/usecaseInterfaces/admin/users/get-user-details-usecase.interface";
import { GetUserDetailsUsecase } from "../../useCases/admin/users/get-user-details.usecase";


// Service Use Cases
import { ICreateServiceUsecase } from "../../entities/usecaseInterfaces/service/create-service-usecase.interface";
import { CreateServiceUsecase } from "../../useCases/service/create-service.usecase";
import { IGetAllPaginatedServicesUsecase } from "../../entities/usecaseInterfaces/vendor/get-all-paginated-services-usecase.interface";
import { GetAllPaginatedServicesUsecase } from "../../useCases/service/get-all-paginated-services.usecase";
import { IUpdateServiceUsecase } from "../../entities/usecaseInterfaces/service/update-service-usecase.interface";
import { UpdateServiceUsecase } from "../../useCases/service/update-service.usecase";

// Payment and Booking Use Cases
import { IPaymentService } from "../../entities/services/stripe-service.interface";
import { StripeService } from "../../interfaceAdapters/services/stripe.service";
import { ICreatePaymentIntentUseCase } from "../../entities/usecaseInterfaces/payment/create-payment-intent-usecase.interface";
import { CreatePaymentIntentUseCase } from "../../useCases/payment/create-payment-intent.usecase";
import { ICreateNewBookingUseCase } from "../../entities/usecaseInterfaces/booking/create-new-booking-usecase.interface";
import { CreateNewBookingUseCase } from "../../useCases/booking/create-new-booking.usecase";
import { IConfirmPaymentUseCase } from "../../entities/usecaseInterfaces/payment/confirm-payment.usecase";
import { ConfirmPaymentUseCase } from "../../useCases/payment/confirm-payment.usecase";
import { IGetAllBookingByClientUseCase } from "../../entities/usecaseInterfaces/booking/get-all-bookings-by-client-usecase.interface";
import { GetAllBookingByClientUseCase } from "../../useCases/booking/get-all-bookings-by-client.usecase";
import { IGetAllBookingForVendorUseCase } from "../../entities/usecaseInterfaces/booking/get-all-booking-for-vendor-usecase.interface";
import { GetAllBookingForVendorUseCase } from "../../useCases/booking/get-all-booking-for-vendor.usecase";
import { IUpdateBookingStatusUseCase } from "../../entities/usecaseInterfaces/booking/update-booking-status-usecse.interface";
import { UpdateBookingStatusUseCase } from "../../useCases/booking/update-booking-status.usecase";
import { ICancelBookingUseCase } from "../../entities/usecaseInterfaces/booking/cancel-booking-usecase.interface";
import { CancelBookingUseCase } from "../../useCases/booking/cancel-booking.usecase";

// Wallet Use Cases
import { IGetWalletDetailsOfUserUseCase } from "../../entities/usecaseInterfaces/wallet/get-wallet-details-of-user-usecase.interface";
import { GetWalletDetailsOfUserUseCase } from "../../useCases/wallet/get-wallet-details-of-user.useacse";
import { IGetAllTransactionsByUserIdUseCase } from "../../entities/usecaseInterfaces/payment/get-all-transactions-by-userId-controlle.interface";
import { GetAllTransactionsByUserIdUseCase } from "../../useCases/payment/get-all-payment-by-userId.usecase";

// Contest Use Cases

// Chat Use Cases
import { ICreateConversationUseCase } from "../../entities/usecaseInterfaces/chat/create-conversation-usecase.interface";
import { CreateConversationUseCase } from "../../useCases/chat/create-conversation.usecase";
import { IGetConversationsUsecase } from "../../entities/usecaseInterfaces/chat/get-conversations-usecase.interface";
import { GetConversationUsecase } from "../../useCases/chat/get-conversations.usecase";
import { IGetMessageUsecase } from "../../entities/usecaseInterfaces/chat/get-messages-usecase.interface";
import { ISendMessageUsecase } from "../../entities/usecaseInterfaces/chat/send-message-usecase.interface";
import { SendMessageUsecase } from "../../useCases/chat/send-message.usecase";
import { IMarkMessageAsReadUsecase } from "../../entities/usecaseInterfaces/chat/mark-message-as-read-usecase.interface";
import { MarkMessageAsReadUsecase } from "../../useCases/chat/mark-message-as-read.usecase";
import { IGetUserContactsUsecase } from "../../entities/usecaseInterfaces/chat/get-user-contacts-usecase.interface";
import { GetUserContactsUsecase } from "../../useCases/chat/get-user-contacts.usecase";
import { IUpdateUserOnlineStatusUsecase } from "../../entities/usecaseInterfaces/chat/update-user-online-status-usecase.interface";
import { UpdateUserOnlineStatusUsecase } from "../../useCases/chat/update-user-online-status.usecase";
import { IUpdateLastSeenUsecase } from "../../entities/usecaseInterfaces/chat/update-last-seen-usecase.interface";
import { UpdateLastSeenUsecase } from "../../useCases/chat/update-last-seen.usecase";
import { IUploadMediaChatUsecase } from "../../entities/usecaseInterfaces/chat/upload-media-chat-usecase.interface";
import { UploadMediaChatUsecase } from "../../useCases/chat/upload-media-chat.usecase";

// Community Use Cases
import { ICreateCommunityUsecase } from "../../entities/usecaseInterfaces/community-contest/community/create-community-usecase.interface";
import { CreateCommunityUsecase } from "../../useCases/community-contest/community/create-community.usecase";
import { IGetAllCommunityUsecase } from "../../entities/usecaseInterfaces/community-contest/community/get-all-communities-usecase.interface";
import { GetAllCommunityUsecase } from "../../useCases/community-contest/community/get-all-community.usecase";
import { IDeleteCommunityUsecase } from "../../entities/usecaseInterfaces/community-contest/community/delete-community-usecase.interface";
import { DeleteCommunityUsecase } from "../../useCases/community-contest/community/delete-community.usecase";
import { IFindCommunityBySlugUsecase } from "../../entities/usecaseInterfaces/community-contest/community/find-by-slug-usecase.interface";
import { FindCommunityBySlugUsecase } from "../../useCases/community-contest/community/find-by-slug.usecase";
import { IUpdateCommunityUsecase } from "../../entities/usecaseInterfaces/community-contest/community/update-community-usecase.interface";
import { UpdateCommunityUsecase } from "../../useCases/community-contest/community/update-community.usecase";
import { ICreateCommunityMemberUsecase } from "../../entities/usecaseInterfaces/community-contest/community/create-community-member-usecase.interface";
import { CreateCommunityMemberUsecase } from "../../useCases/community-contest/community/create-community-member.usecase";
import { ILeaveCommunityUsecase } from "../../entities/usecaseInterfaces/community-contest/community/leave-community-usecase.interface";
import { LeaveCommunityUsecase } from "../../useCases/community-contest/community/leave-community.usecase";
import GetMessagesUseCase from "../../useCases/chat/get-messages.usecase";
import { INotificationUsecase } from "../../entities/usecaseInterfaces/notification/notification-usecase.interface";
import { NotificationUsecase } from "../../useCases/notification/notification.usecase";

export class UsecaseRegistry {
  static registerUsecase(): void {
    // Auth Use Cases
    container.register<IRegisterUsecase>("IRegisterUsecase", {
      useClass: RegisterUsecase,
    });
    container.register<ISendEmailUseCase>("ISendEmailUseCase", {
      useClass: SendEmailUseCase,
    });
    container.register<IVerifyOTPUsecase>("IVerifyOTPUsecase", {
      useClass: VerifyOTPUsecase,
    });
    container.register<IGenerateTokenUsecase>("IGenerateTokenUsecase", {
      useClass: GenerateTokenUsecase,
    });
    container.register<ILogUseCaseIninterface>("ILogUseCaseIninterface", {
      useClass: LoginUseCase,
    });
    container.register<IRefreshTokenUsecase>("IRefreshTokenUsecase", {
      useClass: RefreshTokenUsecase,
    });
    container.register<IGoogleUseCase>("IGoogleUseCase", {
      useClass: GoogleLoginUsecase,
    });
    container.register<IForgotPassWordSendOtpUsecase>(
      "IForgotPassWordSendOtpUsecase",
      { useClass: ForgotPasswordSendOtp }
    );
    container.register<IResetPasswordUsecase>("IResetPasswordUsecase", {
      useClass: ResetPasswordUsecase,
    });

    // Auth Strategies
    container.register<IRegisterStrategy>("ClientRegisterStrategy", {
      useClass: ClientRegisterStrategy,
    });
    container.register<IRegisterStrategy>("VendorRegisterStrategy", {
      useClass: VendorRegisterStrategy,
    });
    container.register<ILoginStrategy>("ClientLoginStrategy", {
      useClass: ClientLoginStrategy,
    });
    container.register<ILoginStrategy>("VendorLoginStrategy", {
      useClass: VendorLoginStrategy,
    });
    container.register<ILoginStrategy>("AdminLoginStrategy", {
      useClass: AdminLoginStrategy,
    });
    container.register<ILoginStrategy>("ClientGoogleLoginStrategy", {
      useClass: ClientGoogleLoginStrategy,
    });
    container.register<ILoginStrategy>("VendorGoogleLoginStrategy", {
      useClass: VendorGoogleLoginStrategy,
    });

    // Security Services
    container.register<IBcrypt>("PasswordBcrypt", { useClass: PasswordBcrypt });
    container.register<IBcrypt>("OtpBcrypt", { useClass: OtpBcrypt });
    container.register<IJwtservice>("IJwtservice", { useClass: JwtService });

    // Email and OTP Services
    container.register<IEmailService>("IEmailService", {
      useClass: EmailService,
    });
    container.register<IEmailExistenceService>("IEmailExistenceService", {
      useClass: EmailExistenceService,
    });
    container.register<IOtpService>("IOtpService", { useClass: OtpService });

    // Client Use Cases
    container.register<IGetClientDetailsUsecase>("IGetClientDetailsUsecase", {
      useClass: GetClientDetailsUsecase,
    });
    container.register<IUpdateClientUsecase>("IUpdateClientUsecase", {
      useClass: UpdateClientUsecase,
    });
    container.register<IGetAllPaginatedVendorsUsecase>(
      "IGetAllPaginatedVendorsUsecase",
      { useClass: GetAllPaginatedVendorsUsecase }
    );
    container.register<IGetAllClientCategoriesUsecase>(
      "IGetAllClientCategoriesUsecase",
      { useClass: GetAllClientCategoriesUsecase }
    );
    container.register<IGetPhotographerDetailsUsecase>(
      "IGetPhotographerDetailsUsecase",
      { useClass: GetPhotographerDetailsUsecase }
    );
    container.register<IGetServiceUsecase>("IGetServiceUsecase", {
      useClass: GetServiceUsecase,
    });
    container.register<IGetAllClientNotificationUsecase>(
      "IGetAllClientNotificationUsecase",
      { useClass: GetAllClientNotificationUsecase }
    );

    // Vendor Use Cases
    container.register<IGetVendorDetailsUsecase>("IGetVendorDetailsUsecase", {
      useClass: GetVendorDetailUsecase,
    });
    container.register<IUpdateVendorProfileUsecase>(
      "IUpdateVendorProfileUsecase",
      { useClass: UpdateVendorUsecase }
    );
    container.register<IGetAllVendorCategoriesUsecase>(
      "IGetAllVendorCategoriesUsecase",
      { useClass: GetAllVendorCategoriesUsecase }
    );
    container.register<IJoinCategoryRequestUsecase>(
      "IJoinCategoryRequestUseCase",
      { useClass: JoinCategoryRequestUseCase }
    );
    container.register<IGetAllVendorNotificationUsecase>(
      "IGetAllVendorNotificationUsecase",
      { useClass: GetAllVendorNotificationUsecase }
    );
    container.register<ICreateWorkSampleUsecase>("ICreateWorkSampleUsecase", {
      useClass: CreateWorkSampleUsecase,
    });
    container.register<IGetPaginatedWorkSampleUsecase>(
      "IGetPaginatedWorkSampleUsecase",
      { useClass: GetAllPaginatedWorkSamplesUsecase }
    );
    container.register<IDeleteWorkSampleUsecase>("IDeleteWorkSampleUsecase", {
      useClass: DeleteWorkSampleUsecase,
    });
    container.register<IUpdateWorkSampleUsecase>("IUpdateWorkSampleUsecase", {
      useClass: UpdateWorkSampleUsecase,
    });

    // Admin Use Cases
    container.register<IGetAllClientUsecase>("IGetAllClientUsecase", {
      useClass: GetAllClientsUsecase,
    });
    container.register<IGetAllVendorsUsecase>("IGetAllVendorsUsecase", {
      useClass: GetAllVendorsUsecase,
    });
    container.register<IUpdateUserStatusUsecase>("IUpdateUserStatusUsecase", {
      useClass: UpdateUserStatusUsecase,
    });
    container.register<IGetPendingVendorRequestUsecase>(
      "IGetPendingVendorRequestUsecase",
      { useClass: GetPendingVendorRequestUsecase }
    );
    container.register<IUpdateVendorRequestUsecase>(
      "IUpdateVendorRequestUsecase",
      { useClass: UpdateVendorRequestUsecase }
    );
    container.register<ICreateNewCategoryUseCase>("ICreateNewCategoryUseCase", {
      useClass: CreateNewCategoryUseCase,
    });
    container.register<IGetAllPaginatedCategoryUseCase>(
      "IGetAllPaginatedCategoryUseCase",
      { useClass: GetAllPaginatedCategoryUseCase }
    );
    container.register<IUpdateCategoryUsecase>("IUpdateCategoryUsecase", {
      useClass: UpdateCategoryUsecase,
    });
    container.register<IGetCategoryRequestUsecase>(
      "IGetCategoryRequestUsecase",
      { useClass: GetCategoryRequestUsecase }
    );
    container.register<IUpdateCategoryRequestStatusUsecase>(
      "IUpdateCategoryRequestStatusUsecase",
      { useClass: UpdateCategoryRequestStatusUsecase }
    );
    container.register<IGetUserDetailsUsecase>("IGetUserDetailsUsecase", {
      useClass: GetUserDetailsUsecase,
    });


    // Service Use Cases
    container.register<ICreateServiceUsecase>("ICreateServiceUsecase", {
      useClass: CreateServiceUsecase,
    });
    container.register<IGetAllPaginatedServicesUsecase>(
      "IGetAllPaginatedServicesUsecase",
      { useClass: GetAllPaginatedServicesUsecase }
    );
    container.register<IUpdateServiceUsecase>("IUpdateServiceUsecase", {
      useClass: UpdateServiceUsecase,
    });

    // Payment and Booking Use Cases
    container.register<IPaymentService>("IPaymentService", {
      useClass: StripeService,
    });
    container.register<ICreatePaymentIntentUseCase>(
      "ICreatePaymentIntentUseCase",
      { useClass: CreatePaymentIntentUseCase }
    );
    container.register<ICreateNewBookingUseCase>("ICreateNewBookingUseCase", {
      useClass: CreateNewBookingUseCase,
    });
    container.register<IConfirmPaymentUseCase>("IConfirmPaymentUseCase", {
      useClass: ConfirmPaymentUseCase,
    });
    container.register<IGetAllBookingByClientUseCase>(
      "IGetAllBookingByClientUseCase",
      { useClass: GetAllBookingByClientUseCase }
    );
    container.register<IGetAllBookingForVendorUseCase>(
      "IGetAllBookingForVendorUseCase",
      { useClass: GetAllBookingForVendorUseCase }
    );
    container.register<IUpdateBookingStatusUseCase>(
      "IUpdateBookingStatusUseCase",
      { useClass: UpdateBookingStatusUseCase }
    );
    container.register<ICancelBookingUseCase>("ICancelBookingUseCase", {
      useClass: CancelBookingUseCase,
    });

    // Wallet Use Cases
    container.register<IGetWalletDetailsOfUserUseCase>(
      "IGetWalletDetailsOfUserUseCase",
      { useClass: GetWalletDetailsOfUserUseCase }
    );
    container.register<IGetAllTransactionsByUserIdUseCase>(
      "IGetAllTransactionsByUserIdUseCase",
      { useClass: GetAllTransactionsByUserIdUseCase }
    );

    // Chat Use Cases
    container.register<ICreateConversationUseCase>(
      "ICreateConversationUseCase",
      { useClass: CreateConversationUseCase }
    );
    container.register<IGetConversationsUsecase>("IGetConversationsUsecase", {
      useClass: GetConversationUsecase,
    });
    container.register<IGetMessageUsecase>("IGetMessageUsecase", {
      useClass: GetMessagesUseCase,
    });
    container.register<ISendMessageUsecase>("ISendMessageUsecase", {
      useClass: SendMessageUsecase,
    });
    container.register<IMarkMessageAsReadUsecase>("IMarkMessageAsReadUsecase", {
      useClass: MarkMessageAsReadUsecase,
    });
    container.register<IGetUserContactsUsecase>("IGetUserContactsUsecase", {
      useClass: GetUserContactsUsecase,
    });
    container.register<IUpdateUserOnlineStatusUsecase>(
      "IUpdateUserOnlineStatusUsecase",
      { useClass: UpdateUserOnlineStatusUsecase }
    );
    container.register<IUpdateLastSeenUsecase>("IUpdateLastSeenUsecase", {
      useClass: UpdateLastSeenUsecase,
    });
    container.register<IUploadMediaChatUsecase>("IUploadMediaChatUsecase", {
      useClass: UploadMediaChatUsecase,
    });

    // Community Use Cases
    container.register<ICreateCommunityUsecase>("ICreateCommunityUsecase", {
      useClass: CreateCommunityUsecase,
    });
    container.register<IGetAllCommunityUsecase>("IGetAllCommunityUsecase", {
      useClass: GetAllCommunityUsecase,
    });
    container.register<IDeleteCommunityUsecase>("IDeleteCommunityUsecase", {
      useClass: DeleteCommunityUsecase,
    });
    container.register<IFindCommunityBySlugUsecase>(
      "IFindCommunityBySlugUsecase",
      { useClass: FindCommunityBySlugUsecase }
    );
    container.register<IUpdateCommunityUsecase>("IUpdateCommunityUsecase", {
      useClass: UpdateCommunityUsecase,
    });
    container.register<ICreateCommunityMemberUsecase>(
      "ICreateCommunityMemberUsecase",
      { useClass: CreateCommunityMemberUsecase }
    );
    container.register<ILeaveCommunityUsecase>("ILeaveCommunityUsecase", {
      useClass: LeaveCommunityUsecase,
    });

    //notification usecases
    container.register<INotificationUsecase>(
      "INotificationUsecase",
      { useClass: NotificationUsecase }
    );
  }
}
