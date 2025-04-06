import { inject, injectable } from "tsyringe";
import { IGetAllPaginatedVendorsUsecase } from "../../entities/usecaseInterfaces/client/get-all-paginated-vendors-usecase-interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { IVendorsFilter } from "../../shared/types/client/vendors-list.type";
import { PaginatedResponse } from "../../shared/types/admin/admin.type";

@injectable()
export class GetAllPaginatedVendorsUsecase implements IGetAllPaginatedVendorsUsecase {
    constructor(
        @inject("IVendorRepository") private vendorRepository : IVendorRepository
    ){}
    async execute(filters: IVendorsFilter): Promise<PaginatedResponse<IVendorEntity>> {
        console.log('in GetAllPaginatedVendorsUsecase');
        const search : Record<string , any> = {}
        const skip = (filters.page ? filters.page - 1 : 0) * (filters.limit || 10);
        const limit = filters.limit || 10;
        const sort = -1;

        if(filters.category && filters.category !== undefined) {
            search.categories = {$in : [filters.category]}
        }
        if(filters.languages && filters.languages !== undefined && filters.languages !== 'Any Language') {
            search.languages = {$in : [filters.languages.trim()]}
        }
        if(filters.location && filters.location !== undefined) {
            search.location = filters.location.trim()
        }
        console.log(search);
        return await this.vendorRepository.find(search, skip, limit, sort);
    }
}