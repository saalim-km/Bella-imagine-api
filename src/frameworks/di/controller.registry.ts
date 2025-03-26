import { container } from "tsyringe";
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

export class ControllerRegistry {
    static registerController() : void {
        // |-------------------------- Controller Registrations --------------------------|
        container.register("RegisterController", { useClass: RegisterController });

        // |-------------------------- Email & OTP Verification --------------------------|
        container.register("SendEmailController", { useClass: SendEmailController });
        container.register("VerifyOTPController", { useClass: VerifyOTPController });

        // |-------------------------- Authentication ------------------------|
        container.register("LoginController", { useClass: LoginController });
        container.register("LogoutController", { useClass: LogoutController });
        container.register("RefreshTokenController", { useClass: RefreshTokenController });
        container.register("GoogleLoginController", { useClass: GoogleLoginController });
        container.register("ForgotPasswordSendOtpController" , {useClass : ForgotPasswordSendOtpController})

        // |-------------------------- User Details --------------------------|
        container.register("GetClientDetailsController", { useClass: GetClientDetailsController });
        container.register("GetVendorDetailsController", { useClass: GetVendorDetailsController });
        container.register("GetUserDetailsController",{useClass : GetUserDetailsController})

         // |-------------------------- User Update --------------------------|
        container.register('UpdateClientController',{useClass : UpdateClientController})
        container.register("UpdateVendorController" , {useClass : UpdateVendorController})

        // |-------------------------- client and Vendor Management --------------------------|
        container.register("GetAllClientsController" , {useClass : GetAllClientsController})
        container.register("GetAllVendorsController" , {useClass : GetAllVendorsController})
        container.register("UpdateUserStatusController" , {useClass : UpdateUserStatusController})
        container.register("ResetPasswordController" , {useClass : ResetPasswordController})


        // |-------------------------- vendor Request --------------------------|
        container.register("GetPendingVendorController" , {useClass : GetPendingVendorController})
        container.register("UpdateVendorRequestController" , {useClass : UpdateVendorRequestController})


        // |-------------------------- category management --------------------------|
        container.register("CreateNewCategoryController", {useClass: CreateNewCategoryController})
        container.register("GetAllPaginatedCategoryController" , {useClass : GetAllPaginatedCategoryController})
        container.register("GetAllVendorCategoriesController" , {useClass : GetAllVendorCategoriesController})
        container.register("UpdateCategoryController" , {useClass : UpdateCategoryController})
        container.register("JoinCategoryRequestUseCase" , {useClass : JoinCategoryRequestController})
        container.register("GetCategoryRequestController",{useClass : GetCategoryRequestController})
        container.register("UpdateCategoryRequestStatusController",{useClass : UpdateCategoryRequestStatusController})

        // |--------------------------------------- Notification management ------------------------------------|
        container.register("IGetAllVendorNotificationController" , {useClass : GetAllVendorNotificationController})
        container.register("IGetAllClientNotificationController" , {useClass : GetAllClientNotificationController})

        // |--------------------------------------- Service management ------------------------------------|
        container.register("CreateServiceController",{useClass : CreateServiceController})
        container.register("GetAllPaginatedServicesController",{useClass : GetAllPaginatedServicesController})
        container.register("UpdateServiceController",{useClass : UpdateServiceController})
    }   
}