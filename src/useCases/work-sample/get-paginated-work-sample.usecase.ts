import { inject, injectable } from "tsyringe";
import { IServiceRepository } from "../../entities/repositoryInterfaces/service/service-repository.interface";
import { IServiceEntity } from "../../entities/models/service.entity";
import { PaginatedResponse } from "../../shared/types/admin/admin.type";
import { IGetPaginatedWorkSampleUsecase } from "../../entities/usecaseInterfaces/vendor/get-paginated-work-sample-usecase.interface";
import { IWorkSampleFilter } from "../../shared/types/vendor/work-sample.types";
import { IWorkSampleEntity } from "../../entities/models/work-sample.entity";
import { IWorkSampleRepository } from "../../entities/repositoryInterfaces/work-sample/work-sample-repository.interface";

@injectable()
export class GetAllPaginatedWorkSamplesUsecase implements IGetPaginatedWorkSampleUsecase {
  constructor(
    @inject("IWorkSampleRepository") private workSampleRepository: IWorkSampleRepository
  ) {}

  async execute(
    filter: IWorkSampleFilter,
    limit: number = 4,
    page: number = 1,
    vendorId : string
  ): Promise<PaginatedResponse<IWorkSampleEntity>> {
    const skip = (page - 1) * limit;

    let search: any = { vendor: vendorId };

    if (filter) {
      if (filter.title) {
        search.title = { $regex: filter.title, $options: 'i' }; // Case-insensitive search
      }

      if (filter.service) {
        search.service = filter.service;
      }

      if (filter.tags?.length) {
        search.tags = { $in: filter.tags };
      }

      if (filter.isPublished !== undefined) {
        search.isPublished = filter.isPublished;
      }
    }

    let sort: any = {};
    if (filter.createdAt !== undefined) {
      sort = { createdAt: filter.createdAt };
    }

    return await this.workSampleRepository.findAllWorkSampleByVendor(search, skip, limit, sort);
  }
}