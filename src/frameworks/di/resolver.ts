import { container } from "tsyringe";
import { DependencyInjection } from ".";

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
import { createS3UrlCache } from "../../shared/cache/s3-url-cache-factory";

DependencyInjection.registerAll();

// Auth Controllers
export const registerController = container.resolve(RegisterController);
export const sendEmailController = container.resolve(SendEmailController);
export const veriryOtpController = container.resolve(VerifyOTPController);
export const loginController = container.resolve(LoginController);
export const logoutController = container.resolve(LogoutController);
export const refreshTokenController = container.resolve(RefreshTokenController);
export const googleLoginController = container.resolve(GoogleLoginController);
export const forgotPasswordController = container.resolve(
  ForgotPasswordSendOtpController
);
export const resetPasswordController = container.resolve(
  ResetPasswordController
);

// Client Controllers
export const getClientDetailsController = container.resolve(
  GetClientDetailsController
);
export const updateClientController = container.resolve(UpdateClientController);
export const getPaginatedVendorsController = container.resolve(
  GetAllPaginatedVendorsController
);
export const getAllClientCategoriesController = container.resolve(
  GetAllClientCategoriesController
);
export const getPhotographerDetailsController = container.resolve(
  GetPhotographerDetailsController
);
export const getServiceController = container.resolve(GetServiceController);
export const getAllClientNotificatioController = container.resolve(
  GetAllClientNotificationController
);

// Vendor Controllers
export const getVendorDetialsController = container.resolve(
  GetVendorDetailsController
);
export const updateVendorController = container.resolve(UpdateVendorController);
export const getAllVendorCategoriesController = container.resolve(
  GetAllVendorCategoriesController
);
export const joinCategoryRequestController = container.resolve(
  JoinCategoryRequestController
);
export const getAllVendorNotificationController = container.resolve(
  GetAllVendorNotificationController
);
export const createServiceController = container.resolve(
  CreateServiceController
);
export const getAllPaginatedServiceController = container.resolve(
  GetAllPaginatedServicesController
);
export const updateServiceController = container.resolve(
  UpdateServiceController
);
export const createWorkSampleController = container.resolve(
  CreateWorkSampleController
);
export const getAllPaginatedWorkSample = container.resolve(
  GetAllPaginatedWorkSampleController
);
export const deleteWorkSampleController = container.resolve(
  DeleteWorkSampleController
);
export const updateWorkSampleController = container.resolve(
  UpdateWorkSampleController
);

// Admin Controllers
export const getAllClientController = container.resolve(
  GetAllClientsController
);
export const getAllVendorController = container.resolve(
  GetAllVendorsController
);
export const updateUserStatusController = container.resolve(
  UpdateUserStatusController
);
export const getPendingVendorController = container.resolve(
  GetPendingVendorController
);
export const updateVendorRequestController = container.resolve(
  UpdateVendorRequestController
);
export const createNewCategoryController = container.resolve(
  CreateNewCategoryController
);
export const getAllPaginatedCategoryController = container.resolve(
  GetAllPaginatedCategoryController
);
export const updateCategoryController = container.resolve(
  UpdateCategoryController
);
export const getCategoryRequestController = container.resolve(
  GetCategoryRequestController
);
export const updateCategoryRequestStatusController = container.resolve(
  UpdateCategoryRequestStatusController
);
export const getUserDetailsController = container.resolve(
  GetUserDetailsController
);

// Payment and Booking Controllers
export const createPaymentIntentController = container.resolve(
  CreatePaymentIntentController
);
export const updateConfirmPayment = container.resolve(ConfirmPaymentController);
export const getAllBookingsByClientController = container.resolve(
  GetAllBookingByClientController
);
export const getAllBookingForVendorController = container.resolve(
  GetAllBookingForVendorController
);
export const updateBookingStatusController = container.resolve(
  UpdateBookingStatusController
);
export const getWalletDetailsOfUserController = container.resolve(
  GetWalletDetailsOfUserController
);
export const getAllTransactionByUserIdController = container.resolve(
  GetAllTransactionsByUserIdController
);

// Chat Controllers
export const chatController = container.resolve(ChatController);

// Community and Services
export const communityController = container.resolve(CommunityController);

// Cache Service
export const awsS3Controller = container.resolve(AwsS3Service);
export const s3UrlCache = createS3UrlCache(awsS3Controller)