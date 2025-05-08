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

export class VendorRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    
    // Authentication Routes
    // Handles vendor logout and token refresh
    this.router.post(
      "/vendor/logout",
      verifyAuth,
      (req: Request, res: Response) => {
        logoutController.handle(req, res);
      }
    );

    this.router.post(
      "/vendor/refresh-token",
      decodeToken,
      (req: Request, res: Response) => {
        refreshTokenController.handle(req, res);
      }
    );

    // Vendor Profile Management Routes
    // Manage vendor details (get and update)
    this.router
      .route("/vendor/details")
      .get(
        verifyAuth,
        authorizeRole(["vendor"]),
        (req: Request, res: Response) => {
          getVendorDetialsController.handle(req, res);
        }
      )
      .put(
        verifyAuth,
        authorizeRole(["vendor"]),
        upload.fields([
          {name : 'profileImage' , maxCount : 1},
          {name : 'verificationDocument' , maxCount : 1}
        ]),
        (req: Request, res: Response) => {
          updateVendorController.handle(req, res);
        }
      );

    // Notification Management Routes
    // Retrieve all notifications for the vendor
    this.router
      .route("/vendor/notification")
      .get(
        verifyAuth,
        authorizeRole(["vendor"]),
        (req: Request, res: Response) => {
          getAllVendorNotificationController.handle(req, res);
        }
      );

    // Category Management Routes
    // Retrieve vendor categories and request to join a category
    this.router
      .route("/vendor/categories")
      .get(
        verifyAuth,
        authorizeRole(["vendor"]),
        (req: Request, res: Response) => {
          getAllVendorCategoriesController.handle(req, res);
        }
      );

    this.router.post(
      "/vendor/categories/join",
      verifyAuth,
      authorizeRole(["vendor"]),
      (req: Request, res: Response) => {
        joinCategoryRequestController.handle(req, res);
      }
    );

    // Service Management Routes
    // Manage services (create, get paginated, update)
    this.router
      .route("/vendor/service")
      .post(
        verifyAuth,
        authorizeRole(["vendor"]),
        (req: Request, res: Response) => {
          createServiceController.handle(req, res);
        }
      )
      .get(
        verifyAuth,
        authorizeRole(["vendor"]),
        (req: Request, res: Response) => {
          getAllPaginatedServiceController.handle(req, res);
        }
      )
      .put(
        verifyAuth,
        authorizeRole(["vendor"]),
        (req: Request, res: Response) => {
          updateServiceController.handle(req, res);
        }
      );

    // Work Sample Management Routes
    // Manage work samples (create, get paginated, update, delete)
    this.router
      .route("/vendor/work-sample")
      .post(
        verifyAuth,
        authorizeRole(["vendor"]),
        (req: Request, res: Response) => {
          createWorkSampleController.handle(req, res);
        }
      )
      .get(
        verifyAuth,
        authorizeRole(["vendor"]),
        (req: Request, res: Response) => {
          getAllPaginatedWorkSample.handle(req, res);
        }
      )
      .delete(
        verifyAuth,
        authorizeRole(["vendor"]),
        (req: Request, res: Response) => {
          deleteWorkSampleController.handle(req, res);
        }
      )
      .put(
        verifyAuth,
        authorizeRole(["vendor"]),
        (req: Request, res: Response) => {
          updateWorkSampleController.handle(req, res);
        }
      );

    // Booking Management Routes
    // Retrieve vendor bookings and update booking status
    this.router.get(
      "/vendor/vendor-bookings",
      verifyAuth,
      authorizeRole(["vendor"]),
      (req: Request, res: Response) => {
        getAllBookingForVendorController.handle(req, res);
      }
    );

    this.router.patch(
      "/vendor/booking/status",
      verifyAuth,
      authorizeRole(["vendor"]),
      (req: Request, res: Response) => {
        updateBookingStatusController.handle(req, res);
      }
    );

    // Wallet Management Routes
    // Retrieve wallet details for the vendor
    this.router.get(
      "/vendor/wallet",
      verifyAuth,
      authorizeRole(["vendor"]),
      (req: Request, res: Response) => {
        getWalletDetailsOfUserController.handle(req, res);
      }
    );
  }
}