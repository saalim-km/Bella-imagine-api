import { inject, injectable } from "tsyringe";
import { IGetUsersStrategy } from "../../../domain/interfaces/usecase/admin-usecase.interface";
import { UserStrategyFilterInput } from "../../../domain/interfaces/usecase/types/admin.types";
import { PaginatedResponse } from "../../../domain/interfaces/usecase/types/common.types";
import { IVendorRepository } from "../../../domain/interfaces/repository/vendor.repository";
import { IVendor } from "../../../domain/models/vendor";
import { Mapper } from "../../../shared/utils/mapper";


@injectable()
export class GetVendorsUsecase implements IGetUsersStrategy<IVendor> {
    constructor(
        @inject('IVendorRepository') private _vendorRepository : IVendorRepository
    ){}

    async getUsers(input: UserStrategyFilterInput): Promise<PaginatedResponse<Partial<IVendor>>> {
        const {limit , page , createdAt , search} = input;
        const skip = (page - 1) * limit;
        const data =  await this._vendorRepository.findAllVendors({filter : search! ,limit : limit , skip : skip , sort : createdAt })
        const vendors = Mapper.vendorListMapper(data.data)
        return {
            data : vendors as unknown as IVendor[],
            total : data.total
        }
    }
}