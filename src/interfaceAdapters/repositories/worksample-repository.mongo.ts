import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IWorkSample } from "../../domain/models/worksample";
import { IWorksampleRepository } from "../../domain/interfaces/repository/worksample.repository";
import { WorkSample } from "../database/schemas/worksample.schema";
import { FilterQuery, SortOrder } from "mongoose";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";

@injectable()
export class WorkSampleRepository extends BaseRepository<IWorkSample> implements IWorksampleRepository {
    constructor(){
        super(WorkSample)
    }
    async getWorkSamples(
      filter: FilterQuery<IWorkSample>,
      skip: number,
      limit: number,
      sort: SortOrder = -1
    ): Promise<PaginatedResponse<IWorkSample>> {
      const [services, total] = await Promise.all([
        this.model
          .find(filter)
          .populate({
            path: "service",
          })
          .sort({ createdAt: sort })
          .skip(skip)
          .limit(limit),
        this.model.countDocuments(filter),
      ]);

    return {
      data: services,
      total: total,
    };
    }
}