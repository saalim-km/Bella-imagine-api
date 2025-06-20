import { inject, injectable } from "tsyringe";
import { IVendorBrowsingUseCase } from "../../domain/interfaces/usecase/client-usecase.interface";
import {
  GetVendorDetailsInput,
  GetVendorsOutput,
  GetVendorsQueryInput,
} from "../../domain/interfaces/usecase/types/client.types";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { IVendor } from "../../domain/models/vendor";
import { FilterQuery, Types } from "mongoose";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor.repository";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { IGetPresignedUrlUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { IService } from "../../domain/models/service";
import { IServiceRepository } from "../../domain/interfaces/repository/service.repository";

@injectable()
export class VendorBrowsingUsecase implements IVendorBrowsingUseCase {
  constructor(
    @inject("IVendorRepository") private _vendorRepsitory: IVendorRepository,
    @inject("IGetPresignedUrlUsecase")
    private _presignedUrl: IGetPresignedUrlUsecase,
    @inject("IServiceRepository")
    private _serviceRepository: IServiceRepository,
    @inject("IGetPresignedUrlUsecase")
    private _pregisnedUrl: IGetPresignedUrlUsecase
  ) {}

  async fetchAvailableVendors(
    input: GetVendorsQueryInput
  ): Promise<PaginatedResponse<GetVendorsOutput>> {
    const {
      limit,
      page,
      languages,
      location,
      categories,
      maxCharge,
      minCharge,
      services,
      sortBy,
      tags,
    } = input;
    const skip = (page - 1) * limit;

    let filter: FilterQuery<IVendor> = {};

    if (location && location.lat !== 0 && location.lng !== 0) {
      filter.geoLocation = {
        type: "Point",
        coordinates: [location.lng, location.lat],
      };
    }

    if (languages && languages.length > 0 && languages !== undefined) {
      filter.languages = languages;
    }

    if (categories && categories.length > 0 && categories !== undefined) {
      filter.categories = categories;
    }

    if (minCharge && minCharge > 0 && minCharge !== undefined) {
      filter.minCharge = minCharge;
    }

    if (maxCharge && maxCharge > 0 && maxCharge !== undefined) {
      filter.maxCharge = maxCharge;
    }

    if (services && services.length > 0 && services !== undefined) {
      filter.services = services;
    }

    if (tags && tags.length > 0 && tags !== undefined) {
      filter.tags = tags;
    }

    let {data,total} = await this._vendorRepsitory.fetchVendorListingsForClients({
      filter: filter,
      limit: limit,
      skip: skip,
      sort: sortBy ? sortBy : { createdAt: -1 },
    });

    data = await Promise.all(
      data.map(async(vendor) => {
        if(vendor.profileImage) {
          vendor.profileImage = await this._pregisnedUrl.getPresignedUrl(vendor.profileImage);
        }

        if(vendor.workSamples.length > 0){
          vendor.workSamples = await Promise.all(vendor.workSamples.map(async(sample)=> {
            if(sample.media.length > 0){
              sample.media = await Promise.all(sample.media.map(async (image)=> {
                return this._pregisnedUrl.getPresignedUrl(image)
              }))
            }
            return sample
          }))
        }

        return vendor
      })
    )


    return {
      data: data,
      total: total
    }
  }

  async fetchVendorProfileById(input: GetVendorDetailsInput): Promise<any> {
    const { vendorId, sampleLimit, samplePage, serviceLimit, servicePage } =
      input;

    const vendor = await this._vendorRepsitory.findVendorDetailsById(vendorId);

    if (!vendor) {
      throw new CustomError(
        ERROR_MESSAGES.VENDOR_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
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

    await Promise.all(
      workSamples.map(async (sample) => {
        const urls = await Promise.all(
          sample.media.map((key) => {
            return this._pregisnedUrl.getPresignedUrl(key);
          })
        );
        sample.media = urls;
      })
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

  async fetchVendorServiceForBooking(
    serviceId: Types.ObjectId
  ): Promise<IService> {
    const service = await this._serviceRepository.findById(serviceId);
    if (!service) {
      throw new CustomError(
        ERROR_MESSAGES.SERVICE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return service;
  }
}
