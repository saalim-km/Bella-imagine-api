import { inject, injectable } from "tsyringe";
import { IVendorController } from "../../domain/interfaces/controller/vendor.controller";
import {
  ICategoryManagementUsecase,
  IGetUserDetailsUsecase,
} from "../../domain/interfaces/usecase/admin-usecase.interface";
import { Request, Response } from "express";
import { objectIdSchema } from "../../shared/utils/zod-validations/validators/validations";
import { CustomRequest } from "../middlewares/auth.middleware";
import { ResponseHandler } from "../../shared/utils/helper/response-handler";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  TRole,
} from "../../shared/constants/constants";
import {
  clearAuthCookies,
  updateCookieWithAccessToken,
} from "../../shared/utils/helper/cookie-helper";
import { IRefreshTokenUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import {
  BookingQuerySchema,
  getAllNotificationtSchema,
  updateBookingSchema,
  updateVendorProfileSchema,
  WalletQuerySchema,
} from "../../shared/utils/zod-validations/presentation/client.schema";
import {
  IServiceCommandUsecase,
  IServiceQueryUsecase,
  IVendorProfileUsecase,
} from "../../domain/interfaces/usecase/vendor-usecase.interface";
import {
  IBookingCommandUsecase,
  IBookingQueryUsecase,
} from "../../domain/interfaces/usecase/booking-usecase.interface";
import { IWalletUsecase } from "../../domain/interfaces/usecase/wallet-usecase.interface";
import {
  CreateServiceSchema,
  createWorkSampleSchema,
  getSeviceSchema,
  getWorkSamplesSchema,
  updateServiceSchema,
  updateWorkSampleSchema,
} from "../../shared/utils/zod-validations/presentation/vendor.schema";
import { INotificationUsecase } from "../../domain/interfaces/usecase/notification-usecase.interface";

@injectable()
export class VendorController implements IVendorController {
  constructor(
    @inject("IGetUserDetailsUsecase")
    private _getUserDetailsUsecase: IGetUserDetailsUsecase,
    @inject("IRefreshTokenUsecase")
    private _refreshTokenUsecase: IRefreshTokenUsecase,
    @inject("IVendorProfileUsecase")
    private _vendorProfileUsecase: IVendorProfileUsecase,
    @inject("IBookingQueryUsecase")
    private _bookingQueryUsecase: IBookingQueryUsecase,
    @inject("ICategoryManagementUsecase")
    private _categoryManagementUsecase: ICategoryManagementUsecase,
    @inject("IBookingCommandUsecase")
    private _bookingCommandUsecase: IBookingCommandUsecase,
    @inject("IWalletUsecase") private _walletUsecase: IWalletUsecase,
    @inject("IServiceCommandUsecase")
    private _serviceCommandUsecase: IServiceCommandUsecase,
    @inject("IServiceQueryUsecase") private _serviceQuery: IServiceQueryUsecase,
    @inject("INotificationUsecase")
    private _notificationUsecase: INotificationUsecase
  ) {}

  async logout(req: Request, res: Response): Promise<void> {
    const user = (req as CustomRequest).user;
    const accessTokenName = `${user.role}_access_token`;
    const refreshTokenName = `${user.role}_refresh_token`;

    clearAuthCookies(res, accessTokenName, refreshTokenName);
    ResponseHandler.success(res, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as CustomRequest).user;

      const accessToken = await this._refreshTokenUsecase.execute({
        _id: user._id,
        email: user.email,
        role: user.role,
        refreshToken: user.refresh_token,
      });

      // FIX: Correct the logic condition
      if (user.role && user.role !== undefined) {
        updateCookieWithAccessToken(
          res,
          accessToken,
          `${user.role}_access_token`
        );
        ResponseHandler.success(res, SUCCESS_MESSAGES.REFRESH_TOKEN_SUCCESS);
        return;
      }

      ResponseHandler.error(
        res,
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        {},
        HTTP_STATUS.UNAUTHORIZED
      );
    } catch (error) {
      console.error("Refresh token error:", error);
      ResponseHandler.error(
        res,
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        {},
        HTTP_STATUS.UNAUTHORIZED
      );
    }
  }

  async getVendorDetails(req: Request, res: Response): Promise<void> {
    const vendorId = objectIdSchema.parse((req as CustomRequest).user._id);
    const vendor = await this._getUserDetailsUsecase.getUserDetail({
      id: vendorId,
      role: "vendor",
    });
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, vendor);
  }

  async updateVendorDetails(req: Request, res: Response): Promise<void> {
    const { _id } = (req as CustomRequest).user;

    // Safe extraction of files (may be undefined)
    const files = req.files as
      | { [key: string]: Express.Multer.File[] }
      | undefined;
    const profileImage = files?.profileImage?.[0];
    const verificationDocument = files?.verificationDocument?.[0];
    const parsed = updateVendorProfileSchema.parse({
      ...req.body,
      vendorId: _id,
      profileImage,
      verificationDocument,
    });

    const vendor = await this._vendorProfileUsecase.updateVendorProfile(parsed);
    ResponseHandler.success(res, SUCCESS_MESSAGES.UPDATE_SUCCESS, vendor);
  }

  async getVendorBookings(req: Request, res: Response): Promise<void> {
    const { _id, role } = (req as CustomRequest).user;
    const parsedObjectId = objectIdSchema.parse(_id);
    const parsed = BookingQuerySchema.parse(req.query);
    const bookings = await this._bookingQueryUsecase.fetchAllBookings({
      userId: parsedObjectId,
      role: role as TRole,
      query: parsed,
    });
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, bookings);
  }

  async getCategories(req: Request, res: Response): Promise<void> {
    const categories = await this._categoryManagementUsecase.getCatForUsers();
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, categories);
  }

  async joinCateoryRequest(req: Request, res: Response): Promise<void> {
    const categoryId = objectIdSchema.parse(req.body.category);
    const vendorId = objectIdSchema.parse((req as CustomRequest).user._id);
    await this._vendorProfileUsecase.createCategoryJoinRequest({
      categoryId,
      vendorId,
    });
    ResponseHandler.success(
      res,
      SUCCESS_MESSAGES.CATEGORY_JOIN_REQUEST_SUCCESS
    );
  }

  // async fetchWallet(req: Request, res: Response): Promise<void> {
  //   const vendorId = objectIdSchema.parse((req as CustomRequest).user._id);
  //   const wallet = await this._walletUsecase.fetchWallet(vendorId);
  //   ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, wallet);
  // }

  async fetchWalletWithPagination(req: Request, res: Response): Promise<void> {
    const vendorId = objectIdSchema.parse((req as CustomRequest).user._id);

    // Parse query parameters using Zod
    const queryOptions = WalletQuerySchema.parse(req.query);

    // Ensure pagination parameters are provided
    if (!queryOptions.page || !queryOptions.limit) {
      throw new Error("Page and limit parameters are required for pagination");
    }

    const result = await this._walletUsecase.fetchWalletWithPagination(
      vendorId,
      queryOptions
    );

    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, {
      wallet: result.wallet,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalTransactions: result.totalTransactions,
        limit: queryOptions.limit,
      },
    });
  }

  async updateBookingStatus(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user._id;
    const parsed = updateBookingSchema.parse({ ...req.query, userId });
    await this._bookingCommandUsecase.updateBookingStatus({
      ...parsed,
      userRole: (req as CustomRequest).user.role as TRole,
    });
    ResponseHandler.success(res, SUCCESS_MESSAGES.UPDATE_SUCCESS);
  }

  async createService(req: Request, res: Response): Promise<void> {
    const vendorId = objectIdSchema.parse((req as CustomRequest).user._id);
    const parsed = CreateServiceSchema.parse(req.body);
    await this._serviceCommandUsecase.createService({
      ...parsed,
      vendor: vendorId,
    });
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED);
  }

  async getServices(req: Request, res: Response): Promise<void> {
    const vendorId = objectIdSchema.parse((req as CustomRequest).user._id);
    const parsed = getSeviceSchema.parse(req.query);
    const services = await this._serviceQuery.getServices({
      ...parsed,
      vendor: vendorId,
    });
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, services);
  }

  async updateService(req: Request, res: Response): Promise<void> {
    const vendorId = objectIdSchema.parse((req as CustomRequest).user._id);
    const parsed = updateServiceSchema.parse(req.body);
    await this._serviceCommandUsecase.updateService({
      ...parsed,
      vendor: vendorId,
    });
    ResponseHandler.success(res, SUCCESS_MESSAGES.UPDATE_SUCCESS);
  }

  async createWorkSample(req: Request, res: Response): Promise<void> {
    const parsed = createWorkSampleSchema.parse({
      ...req.body,
      media: (
        req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
      )?.media,
    });
    console.log("parsed data", parsed);
    await this._serviceCommandUsecase.createWorkSample(parsed);
    ResponseHandler.success(res, SUCCESS_MESSAGES.CREATED);
  }

  async getWorkSamples(req: Request, res: Response): Promise<void> {
    console.log(req.query);
    const vendorId = objectIdSchema.parse((req as CustomRequest).user._id);
    const parsed = getWorkSamplesSchema.parse(req.query);
    console.log("parsed", parsed);
    const workSamples = await this._serviceQuery.getWorkSmaples({
      ...parsed,
      vendor: vendorId,
    });
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, workSamples);
  }

  async deleteWorkSample(req: Request, res: Response): Promise<void> {
    const workSmapleId = objectIdSchema.parse(req.params.workSampleId);
    await this._serviceCommandUsecase.deleteWorkSmaple(workSmapleId);
    ResponseHandler.success(res, SUCCESS_MESSAGES.DELETE_SUCCESS);
  }

  async updateWorkSample(req: Request, res: Response): Promise<void> {
    const parsed = updateWorkSampleSchema.parse({
      ...req.body,
      newImages: (
        req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
      )?.newImages,
    });
    await this._serviceCommandUsecase.updateWorkSample(parsed);
    ResponseHandler.success(res, SUCCESS_MESSAGES.UPDATE_SUCCESS);
  }

  async readAllNotifications(req: Request, res: Response): Promise<void> {
    const userId = objectIdSchema.parse((req as CustomRequest).user._id);
    await this._notificationUsecase.readAllNotifications(userId);
    ResponseHandler.success(res, SUCCESS_MESSAGES.UPDATE_SUCCESS);
  }

  async getAllNotifications(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user._id;
    const parsed = getAllNotificationtSchema.parse({
      ...req.query,
      userId: userId,
    });
    const notifications = await this._notificationUsecase.getAllNotifications(
      parsed
    );
    ResponseHandler.success(
      res,
      SUCCESS_MESSAGES.DATA_RETRIEVED,
      notifications
    );
  }

  async deleteNotifications(req: Request, res: Response): Promise<void> {
    const userId = objectIdSchema.parse((req as CustomRequest).user._id);
    await this._notificationUsecase.clearNotifications(userId);
    ResponseHandler.success(res, SUCCESS_MESSAGES.UPDATE_SUCCESS);
  }

  async deleteService(req: Request, res: Response): Promise<void> {
    const serviceId = objectIdSchema.parse(req.params.serviceId);
    await this._serviceCommandUsecase.deleteService(serviceId);
    ResponseHandler.success(res, SUCCESS_MESSAGES.SERVICE_DELETED);
  }
}
