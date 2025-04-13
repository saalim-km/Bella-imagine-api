import { inject } from "tsyringe";
import { IGetPaginatedContestUsecase } from "../../../entities/usecaseInterfaces/admin/contest/get-paginated-contest-usecase.interface";
import { IContestRepository } from "../../../entities/repositoryInterfaces/contest/contest-repository.interface";
import { IContest } from "../../../entities/models/contenst.entity";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { PaginatedRequestContest } from "../../../shared/types/contest/contest.types";

export class GetPaginatedContestUsecase implements IGetPaginatedContestUsecase {
  constructor(
    @inject("IContestRepository") private contestRepository: IContestRepository
  ) {}

  async execute(
    page: number = 1,
    limit: number = 5,
    filters?: PaginatedRequestContest
  ): Promise<PaginatedResponse<IContest>> {
    let search: Record<string, any> = {};
    const skip = (page - 1) * limit;

    if (filters?.status) {
      search.status = filters.status;
    }

    if (typeof filters?.search === "string" && filters?.search.trim() !== "") {
      search = {
        ...search,
        $or: [{ title: { $regex: filters.search.trim(), $options: "i" } }],
      };
    }

    return await this.contestRepository.getAllContest(search,skip,limit)
  }
}
