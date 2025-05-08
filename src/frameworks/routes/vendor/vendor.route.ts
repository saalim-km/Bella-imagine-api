import { Request, Response } from "express";
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interfaceAdapters/middlewares/auth.middleware";
import { BaseRoute } from "../base.route";
import {
  createServiceController,
  createWorkSampleController,
  deleteWorkSampleController,
  getAllBookingForVendorController,
  getAllPaginatedServiceController,
  getAllPaginatedWorkSample,
  getAllVendorCategoriesController,
  getAllVendorNotificationController,
  getVendorDetialsController,
  getWalletDetailsOfUserController,
  joinCategoryRequestController,
  logoutController,
  refreshTokenController,
  updateBookingStatusController,
  updateServiceController,
  updateVendorController,
  updateWorkSampleController,
} from "../../di/resolver";
import { upload } from "../../../interfaceAdapters/middlewares/multer.middleware";
import { asyncHandler } from "../../../shared/handler/async-handler.utils";

export class VendorRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    // Authentication Routes
    this.router.post(
      "/vendor/logout",
      verifyAuth,
      asyncHandler(logoutController.handle.bind(logoutController))
    );

    this.router.post(
      "/vendor/refresh-token",
      decodeToken,
      asyncHandler(refreshTokenController.handle.bind(refreshTokenController))
    );

    // Vendor Profile Management Routes
    this.router
      .route("/vendor/details")
      .get(
        verifyAuth,
        authorizeRole(["vendor"]),
        asyncHandler(
          getVendorDetialsController.handle.bind(getVendorDetialsController)
        )
      )
      .put(
        verifyAuth,
        authorizeRole(["vendor"]),
        upload.fields([
          { name: "profileImage", maxCount: 1 },
          { name: "verificationDocument", maxCount: 1 },
        ]),
        asyncHandler(updateVendorController.handle.bind(updateVendorController))
      );

    // Notification Management Routes
    this.router
      .route("/vendor/notification")
      .get(
        verifyAuth,
        authorizeRole(["vendor"]),
        asyncHandler(
          getAllVendorNotificationController.handle.bind(
            getAllVendorNotificationController
          )
        )
      );

    // Category Management Routes
    this.router
      .route("/vendor/categories")
      .get(
        verifyAuth,
        authorizeRole(["vendor"]),
        asyncHandler(
          getAllVendorCategoriesController.handle.bind(
            getAllVendorCategoriesController
          )
        )
      );

    this.router.post(
      "/vendor/categories/join",
      verifyAuth,
      authorizeRole(["vendor"]),
      asyncHandler(
        joinCategoryRequestController.handle.bind(joinCategoryRequestController)
      )
    );

    // Service Management Routes
    this.router
      .route("/vendor/service")
      .post(
        verifyAuth,
        authorizeRole(["vendor"]),
        asyncHandler(
          createServiceController.handle.bind(createServiceController)
        )
      )
      .get(
        verifyAuth,
        authorizeRole(["vendor"]),
        asyncHandler(
          getAllPaginatedServiceController.handle.bind(
            getAllPaginatedServiceController
          )
        )
      )
      .put(
        verifyAuth,
        authorizeRole(["vendor"]),
        asyncHandler(
          updateServiceController.handle.bind(updateServiceController)
        )
      );

    // Work Sample Management Routes
    this.router
      .route("/vendor/work-sample")
      .post(
        verifyAuth,
        authorizeRole(["vendor"]),
        asyncHandler(
          createWorkSampleController.handle.bind(createWorkSampleController)
        )
      )
      .get(
        verifyAuth,
        authorizeRole(["vendor"]),
        asyncHandler(
          getAllPaginatedWorkSample.handle.bind(getAllPaginatedWorkSample)
        )
      )
      .delete(
        verifyAuth,
        authorizeRole(["vendor"]),
        asyncHandler(
          deleteWorkSampleController.handle.bind(deleteWorkSampleController)
        )
      )
      .put(
        verifyAuth,
        authorizeRole(["vendor"]),
        asyncHandler(
          updateWorkSampleController.handle.bind(updateWorkSampleController)
        )
      );

    // Booking Management Routes
    this.router.get(
      "/vendor/vendor-bookings",
      verifyAuth,
      authorizeRole(["vendor"]),
      asyncHandler(
        getAllBookingForVendorController.handle.bind(
          getAllBookingForVendorController
        )
      )
    );

    this.router.patch(
      "/vendor/booking/status",
      verifyAuth,
      authorizeRole(["vendor"]),
      asyncHandler(
        updateBookingStatusController.handle.bind(updateBookingStatusController)
      )
    );

    // Wallet Management Routes
    this.router.get(
      "/vendor/wallet",
      verifyAuth,
      authorizeRole(["vendor"]),
      asyncHandler(
        getWalletDetailsOfUserController.handle.bind(
          getWalletDetailsOfUserController
        )
      )
    );
  }
}
