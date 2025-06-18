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
import { count } from "console";

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
    const { limit, page, category, languages, location } = input;
    const skip = (page - 1) * limit;

    let filter: FilterQuery<IVendor> = {};

    if (category && category !== undefined) {
      filter.categories = category;
    }

    if (languages && languages !== undefined) {
      filter.languages = languages;
    }

    let { data, total } =
      await this._vendorRepsitory.fetchVendorListingsForClients({
        filter: filter,
        limit: limit,
        skip,
      });

      data = await Promise.all(
        data.map(async (vendor) => {
        if (vendor.profileImage) {
          vendor.profileImage = await this._pregisnedUrl.getPresignedUrl(
            vendor.profileImage
          );
        }


        vendor.workSamples = await Promise.all(vendor.workSamples.map(async (sample) => {
          if (sample.media.length > 0) {
            sample.media = await Promise.all(
              sample.media.map((image) => {
                return this._pregisnedUrl.getPresignedUrl(image);
              })
            );
          }
          return sample;
        }))
        
        return vendor;
      })
    );

    console.dir(data);

    return {
      data: data,
      total : total
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
