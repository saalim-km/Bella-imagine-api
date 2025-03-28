import { injectable } from "tsyringe";
import { IWorkSampleRepository } from "../../../entities/repositoryInterfaces/work-sample/work-sample-repository.interface";
import { IWorkSampleEntity } from "../../../entities/models/work-sample.entity";
import { workSampleModel } from "../../../frameworks/database/models/work-sample.model";
import { IWorkSampleFilter } from "../../../shared/types/vendor/work-sample.types";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";

@injectable()
export class WorkSampleRepository implements IWorkSampleRepository {
  async create(data: Partial<IWorkSampleEntity>): Promise<void> {
    await workSampleModel.create(data);
  }

  async findAllWorkSampleByVendor(
    filter: IWorkSampleFilter,
    skip: number,
    limit: number,
    sort?: any
  ): Promise<PaginatedResponse<IWorkSampleEntity>> {
    const [services, total] = await Promise.all([
      workSampleModel
        .find(filter)
        .populate({
          path: "service",
        })
        .sort(sort)
        .skip(skip)
        .limit(limit),
      workSampleModel.countDocuments(filter),
    ]);

    return {
      data: services,
      total: total,
    };
  }
}
