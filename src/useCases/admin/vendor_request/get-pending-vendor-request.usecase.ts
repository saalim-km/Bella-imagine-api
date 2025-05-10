import { inject, injectable } from "tsyringe";
import { IGetPendingVendorRequestUsecase } from "../../../entities/usecaseInterfaces/admin/vendor_request/get-pending-vendor-request-usecase.interface";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { IVendorEntity } from "../../../entities/models/vendor.entity";
import { s3UrlCache } from "../../../frameworks/di/resolver";

@injectable()
export class GetPendingVendorRequestUsecase implements IGetPendingVendorRequestUsecase {
    constructor(
        @inject("IVendorRepository") private vendorRepository : IVendorRepository
    ){}

    async execute(filters: any, page: number, limit: number): Promise<PaginatedResponse<IVendorEntity>> {
      const skip = (page - 1) * limit;
    
      let search: any = { role: "vendor"};
    
        
        if (typeof filters.search === 'string' && filters.search.trim() !== '') {
          search = {
            ...search,
            $or: [
              { name: { $regex: filters.search.trim(), $options: "i" } },
              { email: { $regex: filters.search.trim(), $options: "i" } }
            ]
          };
        }
    
      let sort : any = -1;
      if (filters && filters.createdAt !== undefined) {
        sort = filters.createdAt;
      }
      const result = await this.vendorRepository.find(search, skip, limit,sort);
              const mappedData = await Promise.all(
                result.data.map(async (vendor) => {
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
      console.log(result);
      return {
        data : mappedData,
        total : result.total
      }
    }
}
