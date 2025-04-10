import { container } from "tsyringe";
import { DependencyInjection } from ".";
import { RegisterController } from "../../interfaceAdapters/controllers/auth/register.controller";
import { SendEmailController } from "../../interfaceAdapters/controllers/auth/send-email.controller";
import { VerifyOTPController } from "../../interfaceAdapters/controllers/auth/verify-otp.controller";
import { LoginController } from "../../interfaceAdapters/controllers/auth/login.controller";
import { LogoutController } from "../../interfaceAdapters/controllers/auth/logout.controller";
import { RefreshTokenController } from "../../interfaceAdapters/controllers/auth/refresh-token.controller";
import { GoogleLoginController } from "../../interfaceAdapters/controllers/auth/google-login.controller";
import { GetClientDetailsController } from "../../interfaceAdapters/controllers/client/get-client-details.controller";
import { GetVendorDetailsController } from "../../interfaceAdapters/controllers/vendor/get-vendor-details-controller";
import { UpdateClientController } from "../../interfaceAdapters/controllers/client/update-client-profile.controller";
import { UpdateVendorController } from "../../interfaceAdapters/controllers/vendor/updat-vendor-profile.controller";
import { GetAllClientsController } from "../../interfaceAdapters/controllers/admin/get-all-clients.controller";
import { GetAllVendorsController } from "../../interfaceAdapters/controllers/admin/get-all-vendor.controller";
import { UpdateUserStatusController } from "../../interfaceAdapters/controllers/admin/update-user-status.controller";
import { ForgotPasswordSendOtpController } from "../../interfaceAdapters/controllers/auth/forgot-password-send-otp.controller";
import { ResetPasswordController } from "../../interfaceAdapters/controllers/auth/reset-password.controller";
import { GetPendingVendorController } from "../../interfaceAdapters/controllers/admin/get-pending-vendor-request.controller";
import { UpdateVendorRequestController } from "../../interfaceAdapters/controllers/admin/update-vendor-request.controller";
import { CreateNewCategoryController } from "../../interfaceAdapters/controllers/admin/create-new-category.controller";
import { GetAllPaginatedCategoryController } from "../../interfaceAdapters/controllers/admin/get-all-paginated-category.controller";
import { GetAllVendorCategoriesController } from "../../interfaceAdapters/controllers/vendor/get-all-vendor-categories.controller";
import { UpdateCategoryController } from "../../interfaceAdapters/controllers/admin/update-category.controller";
import { JoinCategoryRequestController } from "../../interfaceAdapters/controllers/vendor/join-category-request.controller";
import { GetAllVendorNotificationController } from "../../interfaceAdapters/controllers/vendor/get-all-vendor-notification.controller";
import { GetAllClientNotificationController } from "../../interfaceAdapters/controllers/client/get-all-client-notification.controller";
import { GetCategoryRequestController } from "../../interfaceAdapters/controllers/admin/get-category-request.controller";
import { UpdateCategoryRequestStatusController } from "../../interfaceAdapters/controllers/admin/update-category-request-status.controller";
import { GetUserDetailsController } from "../../interfaceAdapters/controllers/admin/get-user-details.controller";
import { CreateServiceController } from "../../interfaceAdapters/controllers/vendor/create-service.controller";
import { GetAllPaginatedServicesController } from "../../interfaceAdapters/controllers/vendor/get-all-paginated-services.controller";
import { UpdateServiceController } from "../../interfaceAdapters/controllers/vendor/update-service.controller";
import { CreateWorkSampleController } from "../../interfaceAdapters/controllers/vendor/create-work-sample.controller";
import { GetAllPaginatedWorkSampleController } from "../../interfaceAdapters/controllers/vendor/get-all-paginated-work-sample.controller";
import { GetAllPaginatedVendorsController } from "../../interfaceAdapters/controllers/client/get-all-paginated-vendors.controller";
import { GetAllClientCategoriesController } from "../../interfaceAdapters/controllers/client/get-all-client-categories.controller";
import { GetPhotographerDetailsController } from "../../interfaceAdapters/controllers/client/get-photographer-details.controller";
import { DeleteWorkSampleController } from "../../interfaceAdapters/controllers/vendor/delete-work-sample.controller";
import { UpdateWorkSampleController } from "../../interfaceAdapters/controllers/vendor/update-work-sample.controller";
import { GetServiceController } from "../../interfaceAdapters/controllers/client/get-service.controller";
import { CreatePaymentIntentController } from "../../interfaceAdapters/controllers/payment/create-payment-intent-controller";
import { ConfirmPaymentController } from "../../interfaceAdapters/controllers/payment/confirm-payment.controller";
import { GetAllBookingByClientController } from "../../interfaceAdapters/controllers/booking/get-all-bookings-client.controller";
import { GetAllBookingForVendorController } from "../../interfaceAdapters/controllers/booking/get-all-booking-for-vendor.controller";
import { UpdateBookingStatusController } from "../../interfaceAdapters/controllers/booking/update-booking-status.controller";
import { GetWalletDetailsOfUserController } from "../../interfaceAdapters/controllers/wallet/get-wallet-details.controller";
import { GetAllTransactionsByUserIdController } from "../../interfaceAdapters/controllers/payment/get-all-transaction-by-userId.controller";

DependencyInjection.registerAll();

// |==================== User Registration ==========================|
export const registerController = container.resolve(RegisterController);

// |========================= Email & OTP Verification ==================|
export const sendEmailController = container.resolve(SendEmailController);
export const veriryOtpController = container.resolve(VerifyOTPController);

// |========================== Authentication =============================|
export const loginController = container.resolve(LoginController);
export const logoutController = container.resolve(LogoutController);
export const refreshTokenController = container.resolve(RefreshTokenController);
export const googleLoginController = container.resolve(GoogleLoginController);

// |========================= Password Recovery =========================================|
export const forgotPasswordController = container.resolve(
  ForgotPasswordSendOtpController
);
export const resetPasswordController = container.resolve(
  ResetPasswordController
);

// |========================= Client Management ======================================|
export const getClientDetailsController = container.resolve(
  GetClientDetailsController
);
export const updateClientController = container.resolve(UpdateClientController);
export const getAllClientController = container.resolve(
  GetAllClientsController
);

// |=============================== Vendor Management ===============================|
export const getVendorDetialsController = container.resolve(
  GetVendorDetailsController
);
export const updateVendorController = container.resolve(UpdateVendorController);
export const getAllVendorController = container.resolve(
  GetAllVendorsController
);
export const getPendingVendorController = container.resolve(
  GetPendingVendorController
);
export const updateVendorRequestController = container.resolve(
  UpdateVendorRequestController
);

// |================================ User(common) Management ==========================|
export const getUserDetailsController = container.resolve(
  GetUserDetailsController
);
export const updateUserStatusController = container.resolve(
  UpdateUserStatusController
);

// |================================ Category Management ==========================|
export const createNewCategoryController = container.resolve(
  CreateNewCategoryController
);
export const getAllPaginatedCategoryController = container.resolve(
  GetAllPaginatedCategoryController
);
export const getAllVendorCategoriesController = container.resolve(
  GetAllVendorCategoriesController
);
export const updateCategoryController = container.resolve(
  UpdateCategoryController
);
export const joinCategoryRequestController = container.resolve(
  JoinCategoryRequestController
);
export const getCategoryRequestController = container.resolve(
  GetCategoryRequestController
);
export const updateCategoryRequestStatusController = container.resolve(
  UpdateCategoryRequestStatusController
);

// |====================================== Notification Management ====================================|
export const getAllVendorNotificationController = container.resolve(
  GetAllVendorNotificationController
);
export const getAllClientNotificatioController = container.resolve(
  GetAllClientNotificationController
);

// |====================================== Service Management ====================================|
export const createServiceController = container.resolve(
  CreateServiceController
);
export const getAllPaginatedServiceController = container.resolve(
  GetAllPaginatedServicesController
);
export const updateServiceController = container.resolve(
  UpdateServiceController
);

// |====================================== work-sample Management ====================================|
export const createWorkSampleController = container.resolve(
  CreateWorkSampleController
);
export const getAllPaginatedWorkSample = container.resolve(
  GetAllPaginatedWorkSampleController
);

export const getPaginatedVendorsController = container.resolve(
  GetAllPaginatedVendorsController
);
export const getAllClientCategoriesController = container.resolve(
  GetAllClientCategoriesController
);
export const getPhotographerDetailsController = container.resolve(
  GetPhotographerDetailsController
);
export const deleteWorkSampleController = container.resolve(
  DeleteWorkSampleController
);
export const updateWorkSampleController = container.resolve(
  UpdateWorkSampleController
);
export const getServiceController = container.resolve(GetServiceController);
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
)
export const getWalletDetailsOfUserController = container.resolve(
  GetWalletDetailsOfUserController
)
export const getAllTransactionByUserIdController = container.resolve(
  GetAllTransactionsByUserIdController
)
