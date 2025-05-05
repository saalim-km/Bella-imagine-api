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

export class AdminRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    // Authentication Routes
    // Handles admin logout and token refresh
    this.router.post(
      "/admin/logout",
      verifyAuth,
      (req: Request, res: Response) => {
        logoutController.handle(req, res);
      }
    );

    this.router.post(
      "/admin/refresh-token",
      decodeToken,
      (req: Request, res: Response) => {
        refreshTokenController.handle(req, res);
      }
    );

    // Client Management Routes
    // Retrieve all clients
    this.router
      .route("/admin/client")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          getAllClientController.handle(req, res);
        }
      );

    // Vendor Management Routes
    // Retrieve all vendors
    this.router
      .route("/admin/vendor")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          getAllVendorController.handle(req, res);
        }
      );

    // User Management Routes
    // Retrieve user details and update user status
    this.router.get(
      "/admin/user/details",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        getUserDetailsController.handle(req, res);
      }
    );

    this.router.patch(
      "/admin/user-status",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        updateUserStatusController.handle(req, res);
      }
    );

    // Vendor Request Management Routes
    // Manage pending vendor requests (get and update)
    this.router
      .route("/admin/vendor-request")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          getPendingVendorController.handle(req, res);
        }
      )
      .post(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          updateVendorRequestController.handle(req, res);
        }
      );

    // Category Management Routes
    // Manage categories (get all, create, update)
    this.router
      .route("/admin/categories")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) =>
          getAllPaginatedCategoryController.handle(req, res)
      )
      .post(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) =>
          createNewCategoryController.handle(req, res)
      )
      .patch(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          updateCategoryController.handle(req, res);
        }
      )
      .put(
        verifyAuth,
        authorizeRole(['admin']),
        (req: Request, res: Response)=> {
          updateCategoryController.handle(req,res)
        }
      )

    // Category Request Management Routes
    // Manage category requests (get and update status)
    this.router
      .route("/admin/category-request")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          getCategoryRequestController.handle(req, res);
        }
      )
      .patch(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          updateCategoryRequestStatusController.handle(req, res);
        }
      );

    // Wallet Management Routes
    // Retrieve wallet details for a user
    this.router.get(
      "/admin/wallet",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        getWalletDetailsOfUserController.handle(req, res);
      }
    );

    // Transaction Management Routes
    // Retrieve all transactions for a user
    this.router.get(
      "/admin/transactions",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        getAllTransactionByUserIdController.handle(req, res);
      }
    );

    // Contest-Commnity
    this.router
      .route("/admin/community")
      .post(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          communityController.createCommunity(req, res);
        }
      )
      .get(
        (req: Request, res: Response) => {
          communityController.listCommunities(req, res);
        }
      )
      .delete(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          communityController.deleteCommunity(req, res);
        }
      )
      .put(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          communityController.updateCommunity(req, res);
        }
      );

    this.router.get(
      "/admin/community/:slug",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        communityController.findCommunityBySlug(req, res);
      }
    );
  }
}
