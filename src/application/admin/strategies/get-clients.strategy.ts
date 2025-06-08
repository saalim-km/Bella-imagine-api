import { inject, injectable } from "tsyringe";
import { IGetUsersStrategy } from "../../../domain/interfaces/usecase/admin-usecase.interface";
import { UserStrategyFilterInput } from "../../../domain/interfaces/usecase/types/admin.types";
import { PaginatedResponse } from "../../../domain/interfaces/usecase/types/common.types";
import { IClientRepository } from "../../../domain/interfaces/repository/client.repository";
import { IClient } from "../../../domain/models/client";

@injectable()   
export class GetClientsUsecase implements IGetUsersStrategy<IClient> {
    constructor(
        @inject('IClientRepository') private _clientRepository : IClientRepository
    ){}

    async getUsers(input: UserStrategyFilterInput): Promise<PaginatedResponse<IClient>> {
        const {limit , page , createdAt , isblocked , search} = input;
        const skip = (page - 1) * limit;
        return await this._clientRepository.findAllClients({filter : search! ,limit : limit , skip : skip , sort : createdAt })
    }
}