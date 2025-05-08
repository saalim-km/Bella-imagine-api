import { Request, Response } from "express";
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interfaceAdapters/middlewares/auth.middleware";
import { BaseRoute } from "../base.route";
import {
  communityController,
  createNewCategoryController,
  getAllClientController,
  getAllPaginatedCategoryController,
  getAllTransactionByUserIdController,
  getAllVendorController,
  getCategoryRequestController,
  getPendingVendorController,
  getUserDetailsController,
  getWalletDetailsOfUserController,
  logoutController,
  refreshTokenController,
  updateCategoryController,
  updateCategoryRequestStatusController,
  updateUserStatusController,
  updateVendorRequestController,
} from "../../di/resolver";
import { upload } from "../../../interfaceAdapters/middlewares/multer.middleware";
import { asyncHandler } from "../../../shared/handler/async-handler.utils";

export class AdminRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    // Authentication Routes
    this.router.post(
      "/admin/logout",
      verifyAuth,
      asyncHandler(logoutController.handle.bind(logoutController))
    );

    this.router.post(
      "/admin/refresh-token",
      decodeToken,
      asyncHandler(refreshTokenController.handle.bind(refreshTokenController))
    );

    // Client Management Routes
    this.router
      .route("/admin/client")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        asyncHandler(getAllClientController.handle.bind(getAllClientController))
      );

    // Vendor Management Routes
    this.router
      .route("/admin/vendor")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        asyncHandler(getAllVendorController.handle.bind(getAllVendorController))
      );

    // User Management Routes
    this.router.get(
      "/admin/user/details",
      verifyAuth,
      authorizeRole(["admin"]),
      asyncHandler(
        getUserDetailsController.handle.bind(getUserDetailsController)
      )
    );

    this.router.patch(
      "/admin/user-status",
      verifyAuth,
      authorizeRole(["admin"]),
      asyncHandler(
        updateUserStatusController.handle.bind(updateUserStatusController)
      )
    );

    // Vendor Request Management Routes
    this.router
      .route("/admin/vendor-request")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        asyncHandler(
          getPendingVendorController.handle.bind(getPendingVendorController)
        )
      )
      .post(
        verifyAuth,
        authorizeRole(["admin"]),
        asyncHandler(
          updateVendorRequestController.handle.bind(
            updateVendorRequestController
          )
        )
      );

    // Category Management Routes
    this.router
      .route("/admin/categories")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        asyncHandler(
          getAllPaginatedCategoryController.handle.bind(
            getAllPaginatedCategoryController
          )
        )
      )
      .post(
        verifyAuth,
        authorizeRole(["admin"]),
        asyncHandler(
          createNewCategoryController.handle.bind(createNewCategoryController)
        )
      )
      .patch(
        verifyAuth,
        authorizeRole(["admin"]),
        asyncHandler(
          updateCategoryController.handle.bind(updateCategoryController)
        )
      )
      .put(
        verifyAuth,
        authorizeRole(["admin"]),
        asyncHandler(
          updateCategoryController.handle.bind(updateCategoryController)
        )
      );

    // Category Request Management Routes
    this.router
      .route("/admin/category-request")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        asyncHandler(
          getCategoryRequestController.handle.bind(getCategoryRequestController)
        )
      )
      .patch(
        verifyAuth,
        authorizeRole(["admin"]),
        asyncHandler(
          updateCategoryRequestStatusController.handle.bind(
            updateCategoryRequestStatusController
          )
        )
      );

    // Wallet Management Routes
    this.router.get(
      "/admin/wallet",
      verifyAuth,
      authorizeRole(["admin"]),
      asyncHandler(
        getWalletDetailsOfUserController.handle.bind(
          getWalletDetailsOfUserController
        )
      )
    );

    // Transaction Management Routes
    this.router.get(
      "/admin/transactions",
      verifyAuth,
      authorizeRole(["admin"]),
      asyncHandler(
        getAllTransactionByUserIdController.handle.bind(
          getAllTransactionByUserIdController
        )
      )
    );

    // Community-Contest Routes
    this.router
      .route("/admin/community")
      .post(
        verifyAuth,
        authorizeRole(["admin"]),
        upload.fields([
          { name: "iconImage", maxCount: 1 },
          { name: "coverImage", maxCount: 1 },
        ]),
        asyncHandler(
          communityController.createCommunity.bind(communityController)
        )
      )
      .get(
        asyncHandler(
          communityController.listCommunities.bind(communityController)
        )
      )
      .delete(
        verifyAuth,
        authorizeRole(["admin"]),
        asyncHandler(
          communityController.deleteCommunity.bind(communityController)
        )
      )
      .put(
        verifyAuth,
        authorizeRole(["admin"]),
        upload.fields([
          { name: "iconImageUrl", maxCount: 1 },
          { name: "coverImageUrl", maxCount: 1 },
        ]),
        asyncHandler(
          communityController.updateCommunity.bind(communityController)
        )
      );

    this.router.get(
      "/admin/community/:slug",
      verifyAuth,
      authorizeRole(["admin"]),
      asyncHandler(
        communityController.findCommunityBySlug.bind(communityController)
      )
    );
  }
}
