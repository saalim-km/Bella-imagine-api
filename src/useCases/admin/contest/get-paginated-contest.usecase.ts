import { inject, injectable } from "tsyringe";
import { IGetPaginatedContestUsecase } from "../../../entities/usecaseInterfaces/admin/contest/get-paginated-contest-usecase.interface";
import { IContestRepository } from "../../../entities/repositoryInterfaces/contest/contest-repository.interface";
import { IContest } from "../../../entities/models/contenst.entity";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { PaginatedRequestContest } from "../../../shared/types/contest/contest.types";

@injectable()
export class GetPaginatedContestUsecase implements IGetPaginatedContestUsecase {
  constructor(
    @inject("IContestRepository") private contestRepository: IContestRepository
  ) {}

  async execute(
    filters?: PaginatedRequestContest
  ): Promise<PaginatedResponse<IContest>> {
    let search: Record<string, any> = {};
    const skip =
      (filters?.page ? filters.page - 1 : 0) *
      (filters?.limit ? filters.limit : 5);
    const limit = filters?.limit || 5;

    if (filters?.status && filters.status !== undefined) {
      search.status = filters.status;
    }
    if (filters?.search && filters.search !== undefined) {
      search = {
        ...search,
        $or: [{ title: { $regex: filters.search.trim(), $options: "i" } }],
      };
    }

    return await this.contestRepository.getAllContest(search,skip,limit)
  }
}
