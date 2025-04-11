import { inject, injectable } from "tsyringe";
import { IGetAllVendorsUsecase } from "../../entities/usecaseInterfaces/admin/get-all-vendors-usecase.interafce";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { PaginatedResponse } from "../../shared/types/admin/admin.type";

@injectable()
export class GetAllVendorsUsecase implements IGetAllVendorsUsecase {
    constructor(
        @inject("IVendorRepository") private vendorRepository : IVendorRepository
    ){}

    async execute(filters: any, page: number, limit: number): Promise<PaginatedResponse<IVendorEntity>> {
        console.log('--------------------paginatedClientFetch----------------------');
        console.log(filters);
        console.log(page,limit);
        const skip = (page - 1) * limit;
    
      let search: any = { role: "vendor"};
    
    
      if (filters) {
        if (filters.isblocked !== undefined) {
          search.isblocked = filters.isblocked;
        }
        
        if (filters.isActive !== undefined) {
          search.isActive = filters.isActive;
        }
        
        if (typeof filters.search === 'string' && filters.search.trim() !== '') {
          search = {
            ...search,
            $or: [
              { name: { $regex: filters.search.trim(), $options: "i" } },
              { email: { $regex: filters.search.trim(), $options: "i" } }
            ]
          };
        }
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