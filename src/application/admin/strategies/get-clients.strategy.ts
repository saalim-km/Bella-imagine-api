import { inject, injectable } from "tsyringe";
import { IGetUsersStrategy } from "../../../domain/interfaces/usecase/admin-usecase.interface";
import { UserStrategyFilterInput } from "../../../domain/interfaces/usecase/types/admin.types";
import { PaginatedResponse } from "../../../domain/interfaces/usecase/types/common.types";
import { IClientRepository } from "../../../domain/interfaces/repository/client.repository";
import { IClient } from "../../../domain/models/client";
import { Mapper } from "../../../shared/utils/mapper";

@injectable()   
export class GetClientsUsecase implements IGetUsersStrategy<IClient> {
    constructor(
        @inject('IClientRepository') private _clientRepository : IClientRepository
    ){}

    async getUsers(input: UserStrategyFilterInput): Promise<PaginatedResponse<Partial<IClient>>> {
        const {limit , page , createdAt , search} = input;
        const skip = (page - 1) * limit;
        const clients =  await this._clientRepository.findAllClients({filter : search! ,limit : limit , skip : skip , sort : createdAt })
        const data =  Mapper.clientListMapper(clients.data)

        return {
            data: data as unknown as IClient[],
            total : clients.total
        }
    }
}