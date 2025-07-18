import { inject, injectable } from "tsyringe";
import { IVendorProfileUsecase } from "../../domain/interfaces/usecase/vendor-usecase.interface";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor.repository";
import {
  CreateCategoryRequestInput,
  UpdatevendorProfileInput,
} from "../../domain/interfaces/usecase/types/vendor.types";
import { IVendor } from "../../domain/models/vendor";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { UpdateQuery } from "mongoose";
import { IAwsS3Service } from "../../domain/interfaces/service/aws-service.interface";
import { IGetPresignedUrlUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { config } from "../../shared/config/config";
import path from "path";
import { unlinkSync } from "fs";
import { ICategoryRepository } from "../../domain/interfaces/repository/category.repository";
import { ICategoryRequestRepository } from "../../domain/interfaces/repository/category-request.repository";
import { GeoLocation } from "../../domain/models/user-base";
import { Mapper } from "../../shared/utils/mapper";

@injectable()
export class VendorProfileUsecase implements IVendorProfileUsecase {
  constructor(
    @inject("IVendorRepository") private _vendorRepository: IVendorRepository,
    @inject("IAwsS3Service") private _awsService: IAwsS3Service,
    @inject("IGetPresignedUrlUsecase")
    private _presignedUrl: IGetPresignedUrlUsecase,
    @inject("ICategoryRequestRepository")
    private _catRequestRepository: ICategoryRequestRepository,
    @inject("ICategoryRepository")
    private _categoryRepository: ICategoryRepository
  ) {}

  async updateVendorProfile(input: UpdatevendorProfileInput): Promise<IVendor> {
    const {
      languages,
      location,
      name,
      vendorId,
      phoneNumber,
      portfolioWebsite,
      profileDescription,
      profileImage,
      verificationDocument,
    } = input;
    const vendor = await this._vendorRepository.findById(vendorId);
    if (!vendor) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const geoLocation: GeoLocation = {
      type: "Point",
      coordinates: [location.lng, location.lat],
    };

    const dataToUpdate: UpdateQuery<IVendor> = {
      name: name,
      location: location,
      geoLocation: geoLocation,
      portfolioWebsite : portfolioWebsite || "",
      phoneNumber : phoneNumber || "",
      description : profileDescription || "",
      languages : languages || []
    };

    if (profileImage) {
      const isProfileImageExists =
        await this._awsService.isFileAvailableInAwsBucket(vendor.profileImage);
      if (isProfileImageExists) {
        await this._awsService.deleteFileFromAws(vendor.profileImage);
      }

      const fileKey = `${
        config.s3.profile
      }/${vendorId}/${Date.now()}${path.extname(profileImage.originalname)}`;
      await this._awsService.uploadFileToAws(fileKey, profileImage.path);
      unlinkSync(profileImage.path);
      dataToUpdate.profileImage = fileKey;
    }

    if (verificationDocument) {
      const isVerificationDocumentExists =
        await this._awsService.isFileAvailableInAwsBucket(
          vendor.verificationDocument
        );
      if (isVerificationDocumentExists) {
        await this._awsService.deleteFileFromAws(vendor.verificationDocument);
      }

      const fileKey = `${
        config.s3.vendorDocuments
      }/${vendorId}/${Date.now()}${path.extname(
        verificationDocument.originalname
      )}`;
      await this._awsService.uploadFileToAws(
        fileKey,
        verificationDocument.path
      );
      unlinkSync(verificationDocument.path);
      dataToUpdate.verificationDocument = fileKey;
    }

    const updatedVendor = await this._vendorRepository.update(
      vendorId,
      dataToUpdate
    );
    if (!updatedVendor) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (updatedVendor.profileImage) {
      updatedVendor.profileImage = await this._presignedUrl.getPresignedUrl(
        updatedVendor.profileImage
      );
    }
    if (updatedVendor.verificationDocument) {
      updatedVendor.verificationDocument =
        await this._presignedUrl.getPresignedUrl(
          updatedVendor.verificationDocument
        );
    }

    return Mapper.vendorMapper(updatedVendor) as IVendor;
  }

  async createCategoryJoinRequest(
    input: CreateCategoryRequestInput
  ): Promise<void> {
    const { categoryId, vendorId } = input;

    const category = await this._categoryRepository.findById(categoryId);
    if (!category) {
      throw new CustomError(
        ERROR_MESSAGES.CATEGORY_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const vendor = await this._vendorRepository.findById(vendorId);
    if (!vendor) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (vendor.categories && vendor.categories.length > 2) {
      throw new CustomError(
        ERROR_MESSAGES.CATEGORY_JOIN_REQUEST_LIMIT,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const isRequestExists =
      await this._catRequestRepository.isCategoryJoinRequestExists({
        vendorId: vendor._id,
        categoryId: category._id,
      });
    if (isRequestExists) {
      throw new CustomError(
        ERROR_MESSAGES.CATEGORY_JOIN_REQUEST_EXISTS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this._catRequestRepository.create({
      vendorId: vendor._id,
      categoryId: category._id,
    });
  }
}
