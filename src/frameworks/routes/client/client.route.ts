import { Request, RequestHandler, Response } from "express";
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interfaceAdapters/middlewares/auth.middleware";
import { BaseRoute } from "../base.route";
import {
  communityController,
  createPaymentIntentController,
  getAllBookingsByClientController,
  getAllClientCategoriesController,
  getAllClientNotificatioController,
  getClientDetailsController,
  getPaginatedVendorsController,
  getPhotographerDetailsController,
  getServiceController,
  getWalletDetailsOfUserController,
  logoutController,
  refreshTokenController,
  updateBookingStatusController,
  updateClientController,
  updateConfirmPayment,
} from "../../di/resolver";
import { checkStatus } from "../../../interfaceAdapters/middlewares/block-status.middleware";
import { upload } from "../../../interfaceAdapters/middlewares/multer.middleware";
import { asyncHandler } from "../../../shared/handler/async-handler.utils";

export class ClientRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    // Authentication Routes
    this.router.post(
      "/client/logout",
      verifyAuth,
      asyncHandler(logoutController.handle.bind(logoutController))
    );

    this.router.post(
      "/client/refresh-token",
      decodeToken,
      asyncHandler(refreshTokenController.handle.bind(refreshTokenController))
    );

    // Client Profile Management Routes
    this.router
      .route("/client/details")
      .get(
        verifyAuth,
        authorizeRole(["client"]),
        asyncHandler(
          getClientDetailsController.handle.bind(getClientDetailsController)
        )
      )
      .put(
        verifyAuth,
        authorizeRole(["client"]),
        upload.single("profileImage"),
        asyncHandler(updateClientController.handle.bind(updateClientController))
      );

    // Notification Management Routes
    this.router
      .route("/client/notification")
      .get(
        verifyAuth,
        authorizeRole(["client"]),
        asyncHandler(
          getAllClientNotificatioController.handle.bind(
            getAllClientNotificatioController
          )
        )
      );

    // Vendor Discovery Routes
    this.router
      .route("/client/vendors")
      .get(
        verifyAuth,
        authorizeRole(["client"]),
        checkStatus as RequestHandler,
        asyncHandler(
          getPaginatedVendorsController.handle.bind(
            getPaginatedVendorsController
          )
        )
      );

    // Category Management Routes
    this.router.get(
      "/client/categories",
      asyncHandler(
        getAllClientCategoriesController.handle.bind(
          getAllClientCategoriesController
        )
      )
    );

    // Photographer and Service Details Routes
    this.router.get(
      "/client/photographer/:id",
      verifyAuth,
      authorizeRole(["client"]),
      asyncHandler(
        getPhotographerDetailsController.handle.bind(
          getPhotographerDetailsController
        )
      )
    );

    this.router.get(
      "/client/service/:id",
      verifyAuth,
      authorizeRole(["client"]),
      asyncHandler(getServiceController.handle.bind(getServiceController))
    );

    // Payment Management Routes
    this.router.post(
      "/client/create-payment-intent",
      verifyAuth,
      authorizeRole(["client"]),
      asyncHandler(
        createPaymentIntentController.handle.bind(createPaymentIntentController)
      )
    );

    this.router.post(
      "/client/confirm-payment",
      asyncHandler(updateConfirmPayment.handle.bind(updateConfirmPayment))
    );

    // Booking Management Routes
    this.router.get(
      "/client/client-bookings",
      verifyAuth,
      authorizeRole(["client"]),
      asyncHandler(
        getAllBookingsByClientController.handle.bind(
          getAllBookingsByClientController
        )
      )
    );

    this.router.patch(
      "/client/booking/status",
      verifyAuth,
      authorizeRole(["client"]),
      asyncHandler(
        updateBookingStatusController.handle.bind(updateBookingStatusController)
      )
    );

    // Wallet Management Routes
    this.router.get(
      "/client/wallet",
      verifyAuth,
      authorizeRole(["client"]),
      asyncHandler(
        getWalletDetailsOfUserController.handle.bind(
          getWalletDetailsOfUserController
        )
      )
    );

    // Community Management
    this.router.get(
      "/client/community/:slug",
      verifyAuth,
      authorizeRole(["client"]),
      asyncHandler(
        communityController.findCommunityBySlug.bind(communityController)
      )
    );

    this.router
      .route("/client/community/join")
      .post(
        verifyAuth,
        authorizeRole(["client"]),
        asyncHandler(
          communityController.createCommunityMember.bind(communityController)
        )
      )
      .delete(
        verifyAuth,
        authorizeRole(["client"]),
        asyncHandler(
          communityController.leaveCommunity.bind(communityController)
        )
      );
  }
}
