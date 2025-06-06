import { injectable } from "tsyringe";
import { BaseUserRepository } from "./base-user-repository.mongo";
import { IClientRepository } from "../../domain/interfaces/repository/client.repository";
import { IClient } from "../../domain/models/client";
import { Client } from "../database/schemas/client.schema";
import { IAdmin } from "../../domain/models/admin";
import { IBaseRepository } from "../../domain/interfaces/repository/base.repository";

@injectable()
export class ClientRepository extends BaseUserRepository<IClient> implements IClientRepository {
    constructor(){
        super(Client)
    }

    async findAdmin(email: string): Promise<IClient | null> {
        return await this.findOne({email : email , role : 'admin'})
    }

    
}