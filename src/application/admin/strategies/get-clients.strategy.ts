import { inject, injectable } from "tsyringe";
import { IGetUsersStrategy } from "../../../domain/interfaces/usecase/admin-usecase.interface";
import { UsersFilterInput } from "../../../domain/interfaces/usecase/types/admin.types";
import { PaginatedResponse } from "../../../domain/interfaces/usecase/types/common.types";
import { IUser } from "../../../domain/models/user-base";
import { IClientRepository } from "../../../domain/interfaces/repository/client-repository";

@injectable()   
export class GetClientsUsecase implements IGetUsersStrategy {
    constructor(
        @inject('IClientRepository') private _clientRepository : IClientRepository
    ){}

    async getUsers(input: UsersFilterInput): Promise<PaginatedResponse<IUser>> {
        const skip = (input.page - 1) * input.limit;
        
        const [users , count] = await Promise.all([
            this._clientRepository.find(input.search , skip , input.limit , input.createdAt),
            this._clientRepository.count(input.search)
        ])
        
        return {
            data : users,
            total : count
        }
    }
}