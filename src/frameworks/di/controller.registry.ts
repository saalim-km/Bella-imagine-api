import { container } from "tsyringe";

// Auth Controllers
import { RegisterController } from "../../interfaceAdapters/controllers/auth/register.controller";
import { SendEmailController } from "../../interfaceAdapters/controllers/auth/send-email.controller";
import { VerifyOTPController } from "../../interfaceAdapters/controllers/auth/verify-otp.controller";
import { LoginController } from "../../interfaceAdapters/controllers/auth/login.controller";
import { LogoutController } from "../../interfaceAdapters/controllers/auth/logout.controller";
import { RefreshTokenController } from "../../interfaceAdapters/controllers/auth/refresh-token.controller";
import { GoogleLoginController } from "../../interfaceAdapters/controllers/auth/google-login.controller";
import { ForgotPasswordSendOtpController } from "../../interfaceAdapters/controllers/auth/forgot-password-send-otp.controller";
import { ResetPasswordController } from "../../interfaceAdapters/controllers/auth/reset-password.controller";

// Client Controllers
import { GetClientDetailsController } from "../../interfaceAdapters/controllers/client/get-client-details.controller";
import { UpdateClientController } from "../../interfaceAdapters/controllers/client/update-client-profile.controller";
import { GetAllPaginatedVendorsController } from "../../interfaceAdapters/controllers/client/get-all-paginated-vendors.controller";
import { GetAllClientCategoriesController } from "../../interfaceAdapters/controllers/client/get-all-client-categories.controller";
import { GetPhotographerDetailsController } from "../../interfaceAdapters/controllers/client/get-photographer-details.controller";
import { GetServiceController } from "../../interfaceAdapters/controllers/client/get-service.controller";
import { GetAllClientNotificationController } from "../../interfaceAdapters/controllers/client/get-all-client-notification.controller";

// Vendor Controllers
import { GetVendorDetailsController } from "../../interfaceAdapters/controllers/vendor/get-vendor-details-controller";
import { UpdateVendorController } from "../../interfaceAdapters/controllers/vendor/updat-vendor-profile.controller";
import { GetAllVendorCategoriesController } from "../../interfaceAdapters/controllers/vendor/get-all-vendor-categories.controller";
import { JoinCategoryRequestController } from "../../interfaceAdapters/controllers/vendor/join-category-request.controller";
import { GetAllVendorNotificationController } from "../../interfaceAdapters/controllers/vendor/get-all-vendor-notification.controller";
import { CreateServiceController } from "../../interfaceAdapters/controllers/vendor/create-service.controller";
import { GetAllPaginatedServicesController } from "../../interfaceAdapters/controllers/vendor/get-all-paginated-services.controller";
import { UpdateServiceController } from "../../interfaceAdapters/controllers/vendor/update-service.controller";
import { CreateWorkSampleController } from "../../interfaceAdapters/controllers/vendor/create-work-sample.controller";
import { GetAllPaginatedWorkSampleController } from "../../interfaceAdapters/controllers/vendor/get-all-paginated-work-sample.controller";
import { DeleteWorkSampleController } from "../../interfaceAdapters/controllers/vendor/delete-work-sample.controller";
import { UpdateWorkSampleController } from "../../interfaceAdapters/controllers/vendor/update-work-sample.controller";

// Admin Controllers
import { GetAllClientsController } from "../../interfaceAdapters/controllers/admin/users/get-all-clients.controller";
import { GetAllVendorsController } from "../../interfaceAdapters/controllers/admin/users/get-all-vendor.controller";
import { UpdateUserStatusController } from "../../interfaceAdapters/controllers/admin/users/update-user-status.controller";
import { GetPendingVendorController } from "../../interfaceAdapters/controllers/admin/vendor_request/get-pending-vendor-request.controller";
import { UpdateVendorRequestController } from "../../interfaceAdapters/controllers/admin/vendor_request/update-vendor-request.controller";
import { CreateNewCategoryController } from "../../interfaceAdapters/controllers/admin/category/create-new-category.controller";
import { GetAllPaginatedCategoryController } from "../../interfaceAdapters/controllers/admin/category/get-all-paginated-category.controller";
import { UpdateCategoryController } from "../../interfaceAdapters/controllers/admin/category/update-category.controller";
import { GetCategoryRequestController } from "../../interfaceAdapters/controllers/admin/category/get-category-request.controller";
import { UpdateCategoryRequestStatusController } from "../../interfaceAdapters/controllers/admin/category/update-category-request-status.controller";
import { GetUserDetailsController } from "../../interfaceAdapters/controllers/admin/users/get-user-details.controller";

// Payment and Booking Controllers
import { CreatePaymentIntentController } from "../../interfaceAdapters/controllers/payment/create-payment-intent-controller";
import { ConfirmPaymentController } from "../../interfaceAdapters/controllers/payment/confirm-payment.controller";
import { GetAllBookingByClientController } from "../../interfaceAdapters/controllers/booking/get-all-bookings-client.controller";
import { GetAllBookingForVendorController } from "../../interfaceAdapters/controllers/booking/get-all-booking-for-vendor.controller";
import { UpdateBookingStatusController } from "../../interfaceAdapters/controllers/booking/update-booking-status.controller";
import { GetWalletDetailsOfUserController } from "../../interfaceAdapters/controllers/wallet/get-wallet-details.controller";
import { GetAllTransactionsByUserIdController } from "../../interfaceAdapters/controllers/payment/get-all-transaction-by-userId.controller";

// Chat Controllers
import { ChatController } from "../../interfaceAdapters/controllers/chat/chat.controller";

// Community and Services
import { CommunityController } from "../../interfaceAdapters/controllers/community-contest/community.controller";
import { AwsS3Service } from "../../interfaceAdapters/services/awsS3.service";

export class ControllerRegistry {
  static registerController(): void {
    // Auth Controllers
    container.register("RegisterController", { useClass: RegisterController });
    container.register("SendEmailController", {
      useClass: SendEmailController,
    });
    container.register("VerifyOTPController", {
      useClass: VerifyOTPController,
    });
    container.register("LoginController", { useClass: LoginController });
    container.register("LogoutController", { useClass: LogoutController });
    container.register("RefreshTokenController", {
      useClass: RefreshTokenController,
    });
    container.register("GoogleLoginController", {
      useClass: GoogleLoginController,
    });
    container.register("ForgotPasswordSendOtpController", {
      useClass: ForgotPasswordSendOtpController,
    });
    container.register("ResetPasswordController", {
      useClass: ResetPasswordController,
    });

    // Client Controllers
    container.register("GetClientDetailsController", {
      useClass: GetClientDetailsController,
    });
    container.register("UpdateClientController", {
      useClass: UpdateClientController,
    });
    container.register("GetAllPaginatedVendorsController", {
      useClass: GetAllPaginatedVendorsController,
    });
    container.register("GetAllClientCategoriesController", {
      useClass: GetAllClientCategoriesController,
    });
    container.register("GetPhotographerDetailsController", {
      useClass: GetPhotographerDetailsController,
    });
    container.register("GetServiceController", {
      useClass: GetServiceController,
    });
    container.register("IGetAllClientNotificationController", {
      useClass: GetAllClientNotificationController,
    });

    // Vendor Controllers
    container.register("GetVendorDetailsController", {
      useClass: GetVendorDetailsController,
    });
    container.register("UpdateVendorController", {
      useClass: UpdateVendorController,
    });
    container.register("GetAllVendorCategoriesController", {
      useClass: GetAllVendorCategoriesController,
    });
    container.register("JoinCategoryRequestUseCase", {
      useClass: JoinCategoryRequestController,
    });
    container.register("IGetAllVendorNotificationController", {
      useClass: GetAllVendorNotificationController,
    });
    container.register("CreateServiceController", {
      useClass: CreateServiceController,
    });
    container.register("GetAllPaginatedServicesController", {
      useClass: GetAllPaginatedServicesController,
    });
    container.register("UpdateServiceController", {
      useClass: UpdateServiceController,
    });
    container.register("CreateWorkSampleController", {
      useClass: CreateWorkSampleController,
    });
    container.register("GetAllPaginatedWorkSampleController", {
      useClass: GetAllPaginatedWorkSampleController,
    });
    container.register("DeleteWorkSampleController", {
      useClass: DeleteWorkSampleController,
    });
    container.register("UpdateWorkSampleController", {
      useClass: UpdateWorkSampleController,
    });

    // Admin Controllers
    container.register("GetAllClientsController", {
      useClass: GetAllClientsController,
    });
    container.register("GetAllVendorsController", {
      useClass: GetAllVendorsController,
    });
    container.register("UpdateUserStatusController", {
      useClass: UpdateUserStatusController,
    });
    container.register("GetPendingVendorController", {
      useClass: GetPendingVendorController,
    });
    container.register("UpdateVendorRequestController", {
      useClass: UpdateVendorRequestController,
    });
    container.register("CreateNewCategoryController", {
      useClass: CreateNewCategoryController,
    });
    container.register("GetAllPaginatedCategoryController", {
      useClass: GetAllPaginatedCategoryController,
    });
    container.register("UpdateCategoryController", {
      useClass: UpdateCategoryController,
    });
    container.register("GetCategoryRequestController", {
      useClass: GetCategoryRequestController,
    });
    container.register("UpdateCategoryRequestStatusController", {
      useClass: UpdateCategoryRequestStatusController,
    });
    container.register("GetUserDetailsController", {
      useClass: GetUserDetailsController,
    });

    // Payment and Booking Controllers
    container.register("CreatePaymentIntentController", {
      useClass: CreatePaymentIntentController,
    });
    container.register("ConfirmPaymentController", {
      useClass: ConfirmPaymentController,
    });
    container.register("GetAllBookingByClientController", {
      useClass: GetAllBookingByClientController,
    });
    container.register("GetAllBookingForVendorController", {
      useClass: GetAllBookingForVendorController,
    });
    container.register("UpdateBookingStatusController", {
      useClass: UpdateBookingStatusController,
    });
    container.register("GetWalletDetailsOfUserController", {
      useClass: GetWalletDetailsOfUserController,
    });
    container.register("GetAllTransactionsByUserIdController", {
      useClass: GetAllTransactionsByUserIdController,
    });

    // Chat Controllers
    container.register("ChatController", { useClass: ChatController });

    // Community and Services
    container.register("CommunityController", {
      useClass: CommunityController,
    });

    // Cache Service
    container.register("IAwsS3Service", { useClass: AwsS3Service });
  }
}
