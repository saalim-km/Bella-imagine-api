import { inject, injectable } from "tsyringe";
import { IGetUsersStrategy } from "../../../domain/interfaces/usecase/admin-usecase.interface";
import { UsersFilterInput } from "../../../domain/interfaces/usecase/types/admin.types";
import { PaginatedResponse } from "../../../domain/interfaces/usecase/types/common.types";
import { IUser } from "../../../domain/models/user-base";
import { IVendorRepository } from "../../../domain/interfaces/repository/vendor-repository";


@injectable()
export class GetVendorsUsecase implements IGetUsersStrategy {
    constructor(
        @inject('IVendorRepository') private _vendorRepository : IVendorRepository
    ){}

    async getUsers(input: UsersFilterInput): Promise<PaginatedResponse<IUser>> {
        const skip = (input.page - 1) * input.limit;

        const [users , count] = await Promise.all([
            this._vendorRepository.find(input.search , skip , input.limit , input.createdAt),
            this._vendorRepository.count(input.search)
        ])
        
        return {
            data : users,
            total : count
        }
    }
}