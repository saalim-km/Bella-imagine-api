import { inject, injectable } from "tsyringe";
import { IGetPendingVendorRequestUsecase } from "../../../entities/usecaseInterfaces/admin/vendor_request/get-pending-vendor-request-usecase.interface";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { IVendorEntity } from "../../../entities/models/vendor.entity";

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
      console.log(result);
      return result;
    }
}
