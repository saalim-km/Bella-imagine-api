import { Request, RequestHandler, Response } from "express";
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interfaceAdapters/middlewares/auth.middleware";
import { BaseRoute } from "../base.route";
import {
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

export class ClientRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    
    // Authentication Routes
    // Handles client logout and token refresh
    this.router.post(
      "/client/logout",
      verifyAuth,
      (req: Request, res: Response) => {
        logoutController.handle(req, res);
      }
    );

    this.router.post(
      "/client/refresh-token",
      decodeToken,
      (req: Request, res: Response) => {
        refreshTokenController.handle(req, res);
      }
    );

    // Client Profile Management Routes
    // Manage client details (get and update)
    this.router
      .route("/client/details")
      .get(
        verifyAuth,
        authorizeRole(["client"]),
        (req: Request, res: Response) => {
          getClientDetailsController.handle(req, res);
        }
      )
      .put(
        verifyAuth,
        authorizeRole(["client"]),
        (req: Request, res: Response) => {
          updateClientController.handle(req, res);
        }
      );

    // Notification Management Routes
    // Retrieve all notifications for the client
    this.router
      .route("/client/notification")
      .get(
        verifyAuth,
        authorizeRole(["client"]),
        (req: Request, res: Response) => {
          getAllClientNotificatioController.handle(req, res);
        }
      );

    // Vendor Discovery Routes
    // Retrieve paginated vendors
    this.router
      .route("/client/vendors")
      .get(
        verifyAuth,
        authorizeRole(["client"]),
        checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          getPaginatedVendorsController.handle(req, res);
        }
      );

    // Category Management Routes
    // Retrieve all categories available to the client
    this.router.get(
      "/client/categories",
      (req: Request, res: Response) => {
        getAllClientCategoriesController.handle(req, res);
      }
    );

    // Photographer and Service Details Routes
    // Retrieve details of a specific photographer or service
    this.router.get(
      "/client/photographer/:id",
      verifyAuth,
      authorizeRole(["client"]),
      (req: Request, res: Response) => {
        getPhotographerDetailsController.handle(req, res);
      }
    );

    this.router.get(
      "/client/service/:id",
      verifyAuth,
      authorizeRole(["client"]),
      (req: Request, res: Response) => {
        getServiceController.handle(req, res);
      }
    );

    // Payment Management Routes
    // Handle payment intent creation and confirmation
    this.router.post(
      "/client/create-payment-intent",
      verifyAuth,
      authorizeRole(["client"]),
      (req: Request, res: Response) => {
        createPaymentIntentController.handle(req, res);
      }
    );

    this.router.post(
      "/client/confirm-payment",
      (req: Request, res: Response) => {
        updateConfirmPayment.handle(req, res);
      }
    );

    // Booking Management Routes
    // Retrieve client bookings and update booking status
    this.router.get(
      "/client/client-bookings",
      verifyAuth,
      authorizeRole(["client"]),
      (req: Request, res: Response) => {
        getAllBookingsByClientController.handle(req, res);
      }
    );

    this.router.patch(
      "/client/booking/status",
      verifyAuth,
      authorizeRole(["client"]),
      (req: Request, res: Response) => {
        updateBookingStatusController.handle(req, res);
      }
    );

    // Wallet Management Routes
    // Retrieve wallet details for the client
    this.router.get(
      "/client/wallet",
      verifyAuth,
      authorizeRole(["client"]),
      (req: Request, res: Response) => {
        getWalletDetailsOfUserController.handle(req, res);
      }
    );

    // Contest Management Routes
    // Get All Contests
  }
}