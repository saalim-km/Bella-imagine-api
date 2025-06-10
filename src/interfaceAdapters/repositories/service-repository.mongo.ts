import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IService } from "../../domain/models/service";
import { IServiceRepository } from "../../domain/interfaces/repository/service.repository";
import { Service } from "../database/schemas/service.schema";

@injectable()
export class ServiceRepository extends BaseRepository<IService> implements IServiceRepository {
    constructor(){
        super(Service)
    }
}