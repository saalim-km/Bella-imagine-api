import { inject, injectable } from "tsyringe";
import { IGetAllPaginatedServicesUsecase } from "../../entities/usecaseInterfaces/vendor/get-all-paginated-services-usecase.interface";
import { IServiceRepository } from "../../entities/repositoryInterfaces/service/service-repository.interface";
import { IServiceEntity } from "../../entities/models/service.entity";
import { PaginatedResponse } from "../../shared/types/admin/admin.type";
import { IServiceFilter } from "../../shared/types/vendor/service.type";

@injectable()
export class GetAllPaginatedServicesUsecase implements IGetAllPaginatedServicesUsecase {
  constructor(
    @inject("IServiceRepository") private serviceRepository: IServiceRepository
  ) {}

  async execute(
    filter: IServiceFilter,
    limit: number = 4,
    page: number = 1
  ): Promise<PaginatedResponse<IServiceEntity>> {
    const skip = (page - 1) * limit;

    let search: any = {};

    if (filter) {
      if (filter.category) {
        search.category = filter.category; // Assumes category is passed as an ObjectId string
      }

      if (filter.isPublished !== undefined) {
        search.isPublished = filter.isPublished;
      }

    if (filter.serviceTitle?.trim()) {
      search.serviceTitle = { $regex: new RegExp(`^${filter.serviceTitle.trim()}$`, "i") };
    }

      if (filter.tags?.length) {
        search.tags = { $in: filter.tags };
      }

      if (filter.styleSpecialty?.length) {
        search.styleSpecialty = { $in: filter.styleSpecialty };
      }

      if (filter.location?.trim()) {
        search.$or = [
          { "location.city": { $regex: new RegExp(`^${filter.location.trim()}$`, "i") } },
          { "location.state": { $regex: new RegExp(filter.location.trim(), "i") } },
          { "location.country": { $regex: new RegExp(filter.location.trim(), "i") } },
        ];
      }
    }

    let sort: any = {};
    if (filter.createdAt !== undefined) {
      sort = { createdAt: filter.createdAt };
    }

    return await this.serviceRepository.findAll(search, skip, limit, sort);
  }
}