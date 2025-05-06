import { inject, injectable } from "tsyringe";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/community-contest/community-repository.interface";
import { IGetAllCommunityUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/get-all-communities-usecase.interface";
import { ICommunityEntity } from "../../../entities/models/community.entity";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { CustomError } from "../../../entities/utils/custom-error";
import { IAwsS3Service } from "../../../entities/services/awsS3-service.interface";

@injectable()
export class GetAllCommunityUsecase implements IGetAllCommunityUsecase {
  constructor(
    @inject("ICommunityRepository")
    private communityRepository: ICommunityRepository,
    @inject('IAwsS3Service') private awsS3Service : IAwsS3Service
  ) {}

  async execute(dto: {
    page: number;
    limit: number;
  }): Promise<PaginatedResponse<ICommunityEntity>> {
    if (!dto.page || !dto.limit) {
      throw new CustomError("Page and limit are required", 400);
    }
  
    const paginated = await this.communityRepository.findAll(dto.page, dto.limit);
    
    console.log('paginated communities : ',paginated);
    paginated.data = await Promise.all(
      paginated.data.map(async (community) => ({
        ...community,
        iconImage: community.iconImage ? await this.awsS3Service.getFileUrlFromAws(community.iconImage, 604800) : null,
        coverImage: community.coverImage ? await this.awsS3Service.getFileUrlFromAws(community.coverImage, 604800) : null,
      }))
    );
  
    return paginated;
  }
}
