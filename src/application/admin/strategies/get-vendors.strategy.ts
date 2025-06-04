import { inject, injectable } from "tsyringe";
import { IGetUsersStrategy } from "../../../domain/interfaces/usecase/admin-usecase.interface";
import { UserStrategyFilterInput } from "../../../domain/interfaces/usecase/types/admin.types";
import { PaginatedResponse } from "../../../domain/interfaces/usecase/types/common.types";
import { IVendorRepository } from "../../../domain/interfaces/repository/vendor-repository";
import { IVendor } from "../../../domain/models/vendor";


@injectable()
export class GetVendorsUsecase implements IGetUsersStrategy<IVendor> {
    constructor(
        @inject('IVendorRepository') private _vendorRepository : IVendorRepository
    ){}

    async getUsers(input: UserStrategyFilterInput): Promise<PaginatedResponse<IVendor>> {
        const skip = (input.page - 1) * input.limit;

        const [users , count] = await Promise.all([
            this._vendorRepository.find(input.search as IVendor, skip , input.limit , input.createdAt),
            this._vendorRepository.count(input.search)
        ])
        
        return {
            data : users,
            total : count
        }
    }
}