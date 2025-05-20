import { inject, injectable } from "tsyringe";
import { IGetAllPaginatedVendorsUsecase } from "../../entities/usecaseInterfaces/client/get-all-paginated-vendors-usecase-interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { IVendorsFilter } from "../../shared/types/client/vendors-list.type";
import { PaginatedResponse } from "../../shared/types/admin/admin.type";
import { s3UrlCache } from "../../frameworks/di/resolver";

@injectable()
export class GetAllPaginatedVendorsUsecase implements IGetAllPaginatedVendorsUsecase {
  constructor(
    @inject("IVendorRepository") private vendorRepository: IVendorRepository
  ) {}

  async execute(filters: IVendorsFilter): Promise<PaginatedResponse<IVendorEntity>> {
    const search: Record<string, any> = {
      isVerified : {$eq : "accept"},
    };
    const skip = (filters.page ? filters.page - 1 : 0) * (filters.limit || 10);
    const limit = filters.limit || 10;
    const sort = -1;

    if (filters.category) {
      search.categories = { $in: [filters.category] };
    }

    if (filters.languages && filters.languages !== 'Any Language') {
      search.languages = { $in: [filters.languages.trim()] };
    }

    if (filters.location) {
      search.location = filters.location.trim();
    }

    const vendors = await this.vendorRepository.find(search, skip, limit, sort);

    const mappedData = await Promise.all(
      vendors.data.map(async (vendor) => {
        const { password, ...safeVendor } = vendor;

        if (vendor.profileImage) {
          safeVendor.profileImage = await s3UrlCache.getCachedSignUrl(vendor.profileImage);
        }

        if (vendor.verificationDocument) {
          safeVendor.verificationDocument = await s3UrlCache.getCachedSignUrl(vendor.verificationDocument);
        }

        return safeVendor;
      })
    );

    return {
      data: mappedData,
      total: vendors.total,
    };
  }
}
