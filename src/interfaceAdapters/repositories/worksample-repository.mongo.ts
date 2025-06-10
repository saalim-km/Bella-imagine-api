import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IWorkSample } from "../../domain/models/worksample";
import { IWorksampleRepository } from "../../domain/interfaces/repository/worksample.repository";
import { WorkSample } from "../database/schemas/worksample.schema";

@injectable()
export class WorkSampleRepository extends BaseRepository<IWorkSample> implements IWorksampleRepository {
    constructor(){
        super(WorkSample)
    }
}