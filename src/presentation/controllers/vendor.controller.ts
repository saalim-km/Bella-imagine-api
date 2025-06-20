import { inject, injectable } from "tsyringe";
import { IVendorController } from "../../domain/interfaces/controller/vendor.controller";
import {
  ICategoryManagementUsecase,
  IGetUserDetailsUsecase,
} from "../../domain/interfaces/usecase/admin-usecase.interface";
import { Request, Response } from "express";
import {
  objectIdSchema,
} from "../../shared/utils/zod-validations/validators/validations";
import { CustomRequest } from "../middlewares/auth.middleware";
import { ResponseHandler } from "../../shared/utils/helper/response-handler";
import { SUCCESS_MESSAGES, TRole } from "../../shared/constants/constants";
import {
  clearAuthCookies,
  updateCookieWithAccessToken,
} from "../../shared/utils/helper/cookie-helper";
import { IRefreshTokenUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import {
  BookingQuerySchema,
  updateBookingSchema,
  updateVendorProfileSchema,
} from "../../shared/utils/zod-validations/presentation/client.schema";
import { IServiceCommandUsecase, IServiceQueryUsecase, IVendorProfileUsecase } from "../../domain/interfaces/usecase/vendor-usecase.interface";
import {
  IBookingCommandUsecase,
  IBookingQueryUsecase,
} from "../../domain/interfaces/usecase/booking-usecase.interface";
import { IWalletUsecase } from "../../domain/interfaces/usecase/wallet-usecase.interface";
import { CreateServiceSchema, createWorkSampleSchema, getSeviceSchema, getWorkSamplesSchema, updateServiceSchema, updateWorkSampleSchema } from "../../shared/utils/zod-validations/presentation/vendor.schema";

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
    @inject('IServiceCommandUsecase') private _serviceCommandUsecase : IServiceCommandUsecase,
    @inject('IServiceQueryUsecase') private _serviceQuery : IServiceQueryUsecase
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

    console.log("parsed data:", parsed);
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
    const categories = await this._categoryManagementUsecase.getCatForUsers()
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

  async fetchWallet(req: Request, res: Response): Promise<void> {
    const vendorId = objectIdSchema.parse((req as CustomRequest).user._id);
    const wallet = await this._walletUsecase.fetchWallet(vendorId);
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, wallet);
  }

  async updateBookingStatus(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user._id;
    const parsed = updateBookingSchema.parse({ ...req.query, userId });
    await this._bookingCommandUsecase.updateBookingStatus(parsed);
    ResponseHandler.success(res, SUCCESS_MESSAGES.UPDATE_SUCCESS);
  }

  async createService(req: Request, res: Response): Promise<void> {
    const vendorId = objectIdSchema.parse((req as CustomRequest).user._id);
    const parsed = CreateServiceSchema.parse(req.body)
    console.log('parsed data : ');
    console.dir(parsed);
    await this._serviceCommandUsecase.createService({...parsed,vendor : vendorId})
    ResponseHandler.success(res,SUCCESS_MESSAGES.DATA_RETRIEVED)
  }

  async getServices(req: Request, res: Response): Promise<void> {
    const vendorId = objectIdSchema.parse((req as CustomRequest).user._id);
    const parsed = getSeviceSchema.parse(req.query)
    const services = await this._serviceQuery.getServices({...parsed,vendor : vendorId})
    ResponseHandler.success(res,SUCCESS_MESSAGES.DATA_RETRIEVED,services)
  }

  async updateService(req: Request, res: Response): Promise<void> {
    const vendorId = objectIdSchema.parse((req as CustomRequest).user._id);
    const parsed =  updateServiceSchema.parse(req.body)
    await this._serviceCommandUsecase.updateService({...parsed,vendor : vendorId})
    ResponseHandler.success(res,SUCCESS_MESSAGES.UPDATE_SUCCESS)
  }

  async createWorkSample(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    console.log(req.files);
    const parsed = createWorkSampleSchema.parse({ ...req.body, media: (req.files as { [fieldname: string]: Express.Multer.File[] } | undefined)?.media })
    console.log('parsed data',parsed);
    await this._serviceCommandUsecase.createWorkSample(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.CREATED);
  }

  async getWorkSamples(req: Request, res: Response): Promise<void> {
    const vendorId = objectIdSchema.parse((req as CustomRequest).user._id);
    const parsed = getWorkSamplesSchema.parse(req.query);
    const workSamples = await this._serviceQuery.getWorkSmaples({...parsed,vendor : vendorId})
    ResponseHandler.success(res,SUCCESS_MESSAGES.DATA_RETRIEVED,workSamples)
  }

  async deleteWorkSample(req: Request, res: Response): Promise<void> {
    const workSmapleId = objectIdSchema.parse(req.params.workSampleId)
    await this._serviceCommandUsecase.deleteWorkSmaple(workSmapleId)
    ResponseHandler.success(res,SUCCESS_MESSAGES.DELETE_SUCCESS)
  }
  
  async updateWorkSample(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    console.log(req.files);
    const parsed = updateWorkSampleSchema.parse({...req.body,newImages : (req.files as { [fieldname: string]: Express.Multer.File[] } | undefined)?.newImages});
    await this._serviceCommandUsecase.updateWorkSample(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.UPDATE_SUCCESS)
  }
}
