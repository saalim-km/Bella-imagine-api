import { inject, injectable } from "tsyringe";
import { IVendorBrowsingUseCase } from "../../domain/interfaces/usecase/client-usecase.interface";
import {
  GetVendorDetailsInput,
  GetVendorsQueryInput,
} from "../../domain/interfaces/usecase/types/client.types";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { IVendor } from "../../domain/models/vendor";
import { FilterQuery } from "mongoose";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor.repository";
import { CustomError } from "../../shared/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { IGetPresignedUrlUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";

@injectable()
export class VendorBrowsingUsecase implements IVendorBrowsingUseCase {
  constructor(
    @inject("IVendorRepository") private _vendorRepsitory: IVendorRepository,
    @inject("IGetPresignedUrlUsecase")
    private _presignedUrl: IGetPresignedUrlUsecase
  ) {}

  async fetchAvailableVendors(
    input: GetVendorsQueryInput
  ): Promise<PaginatedResponse<IVendor>> {
    const { limit, page, category, languages, location } = input;
    const skip = (page - 1) * limit;

    let filter: FilterQuery<IVendor> = {};

    if (category && category !== undefined) {
      filter.categories = category;
    }

    if (languages && languages !== undefined) {
      filter.languages = languages;
    }

    return await this._vendorRepsitory.fetchVendorListingsForClients({
      filter: filter,
      limit: limit,
      skip,
    });
  }

  async fetchVendorProfileById(input: GetVendorDetailsInput): Promise<any> {
    const { vendorId, sampleLimit, samplePage, serviceLimit, servicePage } =
      input;

    const vendor = await this._vendorRepsitory.findVendorDetailsById(vendorId);

    if (!vendor) {
      throw new CustomError(
        ERROR_MESSAGES.VENDOR_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (vendor.profileImage) {
      const cachedUrl = await this._presignedUrl.getPresignedUrl(
        vendor.profileImage
      );
      vendor.profileImage = cachedUrl;
    }

    const { data: services, total: totalServices } =
      await this._vendorRepsitory.getPaginatedServices(
        vendorId,
        servicePage,
        serviceLimit
      );
    const { data: workSamples, total: totalSamples } =
      await this._vendorRepsitory.getPaginatedWorkSamples(
        vendorId,
        samplePage,
        sampleLimit
      );

    return {
      ...vendor,
      services,
      servicePagination: {
        page: servicePage,
        limit: serviceLimit,
        total: totalServices,
      },
      workSamples,
      samplePagination: {
        page: samplePage,
        limit: sampleLimit,
        total: totalSamples,
      },
    };
  }
}
