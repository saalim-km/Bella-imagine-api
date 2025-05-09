import { inject, injectable } from "tsyringe";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/community-contest/community-repository.interface";
import { IGetAllCommunityUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/get-all-communities-usecase.interface";
import { ICommunityEntity } from "../../../entities/models/community.entity";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { CustomError } from "../../../entities/utils/custom-error";
import { IAwsS3Service } from "../../../entities/services/awsS3-service.interface";
import { redisClient } from "../../../frameworks/redis/redis.client";
import logger from "../../../shared/logger/logger.utils";
import { s3UrlCache } from "../../../frameworks/di/resolver";

@injectable()
export class GetAllCommunityUsecase implements IGetAllCommunityUsecase {
  constructor(
    @inject("ICommunityRepository")
    private communityRepository: ICommunityRepository,
    @inject("IAwsS3Service")
    private awsS3Service: IAwsS3Service
  ) {}

  async execute(dto: {
    page: number;
    limit: number;
  }): Promise<PaginatedResponse<ICommunityEntity>> {
    const { page, limit } = dto;

    if (!page || !limit) {
      throw new CustomError("Page and limit are required", 400);
    }

    logger.info(`Fetching communities - Page: ${page}, Limit: ${limit}`);
    const paginated = await this.communityRepository.findAll(page, limit);

    logger.info(`Total communities fetched: ${paginated.data.length}`);

    paginated.data = await Promise.all(
      paginated.data.map(async (community) => {
        const iconImage = await s3UrlCache.getCachedSignUrl(community.iconImage!)
        const coverImage = await s3UrlCache.getCachedSignUrl(community.coverImage!)
        return {
          ...community,
          iconImage,
          coverImage,
        };
      })
    );

    return paginated;
  }
}