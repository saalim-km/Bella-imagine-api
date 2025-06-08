import { injectable } from "tsyringe";
import { BaseUserRepository } from "./base-user-repository.mongo";
import { IClientRepository } from "../../domain/interfaces/repository/client.repository";
import { IClient } from "../../domain/models/client";
import { Client } from "../database/schemas/client.schema";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { FilterQuery } from "mongoose";
import { GetUsersInput } from "../../domain/types/admin.type";

@injectable()
export class ClientRepository extends BaseUserRepository<IClient> implements IClientRepository {
    constructor(){
        super(Client)
    }

    async findAdmin(email: string): Promise<IClient | null> {
        return await this.findOne({email : email , role : 'admin'})
    }

    async findAllClients(input: GetUsersInput): Promise<PaginatedResponse<IClient>> {
        const {filter , limit , skip , sort} = input;
        let query : FilterQuery<IClient> = {};
        if(filter.isblocked) {
            query.isblocked = filter.isblocked;
        }
        query = {
            ...query,
            $or : [{name : {$regex : filter.name || '' , $options : "i"}},
                    {email : {$regex : filter.email || ''  , $options : "i"}}
            ]
        }

        console.log(query);
        const [clients , count] = await Promise.all([
            this.findAll(query,skip,limit,sort),
            this.count(query)
        ])
        console.log(clients);
        return {
            data : clients,
            total : count
        }
    }
}