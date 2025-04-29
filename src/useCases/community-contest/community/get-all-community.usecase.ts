import { inject, injectable } from "tsyringe";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/community-contest/community-repository.interface";
import { IGetAllCommunityUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/get-all-communities-usecase.interface";
import { ICommunityEntity } from "../../../entities/models/community.entity";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class GetAllCommunityUsecase implements IGetAllCommunityUsecase {
  constructor(
    @inject("ICommunityRepository")
    private communityRepository: ICommunityRepository
  ) {}

  async execute(dto: {
    page: number;
    limit: number;
  }): Promise<PaginatedResponse<ICommunityEntity>> {
    if (!dto.page || !dto.limit) {
      throw new CustomError("Page and limit are required", 400);
    }

    return await this.communityRepository.findAll(dto.page, dto.limit);
  }
}
