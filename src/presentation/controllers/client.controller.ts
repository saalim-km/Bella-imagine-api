import { inject, injectable } from "tsyringe";
import { IClientController } from "../../domain/interfaces/controller/client.controller";
import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth.middleware";
import { Stripe } from "stripe";
import {
  clearAuthCookies,
  updateCookieWithAccessToken,
} from "../../shared/utils/helper/cookie-helper";
import { ResponseHandler } from "../../shared/utils/helper/response-handler";
import { SUCCESS_MESSAGES, TRole } from "../../shared/constants/constants";
import { IRefreshTokenUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import {
  ICategoryManagementUsecase,
  IGetUserDetailsUsecase,
} from "../../domain/interfaces/usecase/admin-usecase.interface";
import {
  BookingQuerySchema,
  createBookingSchema,
  FetchAllCommunitiesSchema,
  getVendorDetailsSchema,
  getVendorsSchema,
  updateBookingSchema,
  updateClientProfile,
} from "../../shared/utils/zod-validations/presentation/client.schema";
import {
  IClientProfileUsecase,
  IVendorBrowsingUseCase,
} from "../../domain/interfaces/usecase/client-usecase.interface";
import {
  objectIdSchema,
} from "../../shared/utils/zod-validations/validators/validations";
import { IStripeService } from "../../domain/interfaces/service/stripe-service.interface";
import {
  IBookingCommandUsecase,
  IBookingQueryUsecase,
} from "../../domain/interfaces/usecase/booking-usecase.interface";
import { IWalletUsecase } from "../../domain/interfaces/usecase/wallet-usecase.interface";
import { ICommunityRepository } from "../../domain/interfaces/repository/community.repository";

@injectable()
export class ClientController implements IClientController {
  constructor(
    @inject("IRefreshTokenUsecase")
    private _refreshTokenUsecase: IRefreshTokenUsecase,
    @inject("ICategoryManagementUsecase")
    private _categoryManagementUsecase: ICategoryManagementUsecase,
    @inject("IVendorBrowsingUseCase")
    private _vendorBrowsingUsecase: IVendorBrowsingUseCase,
    @inject("IBookingCommandUsecase")
    private _bookingCommandUsecase: IBookingCommandUsecase,
    @inject("IStripeService") private _stripeService: IStripeService,
    @inject("IGetUserDetailsUsecase")
    private _getUserDetailsUsecase: IGetUserDetailsUsecase,
    @inject("IClientProfileUsecase")
    private _clientProfileUsecase: IClientProfileUsecase,
    @inject("IBookingQueryUsecase")
    private _bookingQueryUsecase: IBookingQueryUsecase,
    @inject("IWalletUsecase") private _walletUsecase: IWalletUsecase,
  ) {}

  async logout(req: Request, res: Response): Promise<void> {
    const user = (req as CustomRequest).user;
    const accessTokenName = `${user.role}_access_token`;
    const refreshTokenName = `${user.role}_refresh_token`;

    clearAuthCookies(res, accessTokenName, refreshTokenName);
    ResponseHandler.success(res, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const user = (req as CustomRequest).user;
    const accessToken = await this._refreshTokenUsecase.execute({
      _id: user._id,
      email: user.email,
      role: user.role,
      refreshToken: user.refresh_token,
    });

    updateCookieWithAccessToken(res, accessToken, `${user.role}_access_token`);
    ResponseHandler.success(res, SUCCESS_MESSAGES.REFRESH_TOKEN_SUCCESS, {
      accessToken,
    });
  }

  async getVendors(req: Request, res: Response): Promise<void> {
    const parsed = getVendorsSchema.parse(req.query);
    const vendors = await this._vendorBrowsingUsecase.fetchAvailableVendors(
      parsed
    );
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, vendors);
  }

  async getCategories(req: Request, res: Response): Promise<void> {
    const categories = await this._categoryManagementUsecase.getCategories({
      limit: 10,
      page: 1,
    });
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, categories);
  }

  async getVendorDetails(req: Request, res: Response): Promise<void> {
    const parsed = getVendorDetailsSchema.parse(req.query);
    const vendorId = objectIdSchema.parse(req.params.vendorId);
    const vendor = await this._vendorBrowsingUsecase.fetchVendorProfileById({
      ...parsed,
      vendorId: vendorId,
    });
    console.log(vendor);
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, vendor);
  }

  async getServiceDetails(req: Request, res: Response): Promise<void> {
    const serviceId = objectIdSchema.parse(req.params.serviceId);
    const service =
      await this._vendorBrowsingUsecase.fetchVendorServiceForBooking(serviceId);
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, service);
  }

  async createPaymentIntent(req: Request, res: Response): Promise<void> {
    const { _id } = (req as CustomRequest).user;
    const parsed = createBookingSchema.parse({ ...req.body, clientId: _id });
    const clientSecret =
      await this._bookingCommandUsecase.createPaymentIntentAndBooking(parsed);
    ResponseHandler.success(
      res,
      SUCCESS_MESSAGES.CLIENT_SECRET_SUCCESS,
      clientSecret
    );
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    console.log(
      "------------------------webhook triggered--------------------"
    );
    const event: Stripe.Event = req.body;
    await this._stripeService.handleWebhookEvent(event);
  }

  async getClientDetails(req: Request, res: Response): Promise<void> {
    const clientId = objectIdSchema.parse((req as CustomRequest).user._id);
    const client = await this._getUserDetailsUsecase.getUserDetail({
      id: clientId,
      role: "client",
    });
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, client);
  }

  async updateClientDetails(req: Request, res: Response): Promise<void> {
    const { _id } = (req as CustomRequest).user;
    const parsed = updateClientProfile.parse({
      ...req.body,
      clientId: _id,
      profileImage: req.file,
    });
    const client = await this._clientProfileUsecase.updateClientProfile(parsed);
    ResponseHandler.success(res, SUCCESS_MESSAGES.UPDATE_SUCCESS, client);
  }

  async getallBookings(req: Request, res: Response): Promise<void> {
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

  async fetchWallet(req: Request, res: Response): Promise<void> {
    const { _id } = (req as CustomRequest).user;
    const parsedObjectId = objectIdSchema.parse(_id);
    const wallet = await this._walletUsecase.fetchWallet(parsedObjectId);
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, wallet);
  }

  async updateBookingStatus(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user._id;
    const parsed = updateBookingSchema.parse({ ...req.query, userId });
    await this._bookingCommandUsecase.updateBookingStatus(parsed);
    ResponseHandler.success(res, SUCCESS_MESSAGES.UPDATE_SUCCESS);
  }
}
