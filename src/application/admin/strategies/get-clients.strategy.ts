import { inject, injectable } from "tsyringe";
import { IGetUsersStrategy } from "../../../domain/interfaces/usecase/admin-usecase.interface";
import { UserStrategyFilterInput } from "../../../domain/interfaces/usecase/types/admin.types";
import { PaginatedResponse } from "../../../domain/interfaces/usecase/types/common.types";
import { IClientRepository } from "../../../domain/interfaces/repository/client.repository";
import { IClient } from "../../../domain/models/client";
import { FilterQuery } from "mongoose";

@injectable()   
export class GetClientsUsecase implements IGetUsersStrategy<IClient> {
    constructor(
        @inject('IClientRepository') private _clientRepository : IClientRepository
    ){}

    async getUsers(input: UserStrategyFilterInput): Promise<PaginatedResponse<IClient>> {
        const skip = (input.page - 1) * input.limit;
        
        const [users , count] = await Promise.all([
            this._clientRepository.find(input.search as FilterQuery<IClient>, skip , input.limit , input.createdAt),
            this._clientRepository.count(input.search)
        ])
        
        return {
            data : users,
            total : count
        }
    }
}