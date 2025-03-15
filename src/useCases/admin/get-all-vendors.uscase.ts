import { inject, injectable } from "tsyringe";
import { IGetAllVendorsUsecase } from "../../entities/usecaseIntefaces/admin/get-all-vendors-usecase.interafce";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { PaginatedResponse } from "../../shared/types/admin/admin.type";

@injectable()
export class GetAllVendorsUsecase implements IGetAllVendorsUsecase {
    constructor(
        @inject("IVendorRepository") private vendorRepository : IVendorRepository
    ){}

    async execute(filter: any, page?: number, limit?: number): Promise<PaginatedResponse<IVendorEntity>> {
        console.log('--------------------paginatedClientFetch----------------------');

        if(!page || !limit) {
            throw new Error("limit and page is required for pagination")
        }
        
        const skip = (page - 1) * limit;
    
        const serach = filter ? { name: { $regex: filter, $options: "i" } } : {};
        const result = await this.vendorRepository.find(serach, skip, limit);
        console.log(result);
        return result;
    }
}