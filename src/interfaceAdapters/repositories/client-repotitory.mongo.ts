import { injectable } from "tsyringe";
import { BaseUserRepository } from "./base-user-repository.mongo";
import { IClientRepository } from "../../domain/interfaces/repository/client-repository";
import { IClient } from "../../domain/models/client";

@injectable()
export class ClientRepository extends BaseUserRepository<IClient> implements IClientRepository {
    
}