import { inject, injectable } from "tsyringe";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/community-contest/community-repository.interface";
import { IGetAllCommunityUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/get-all-communities-usecase.interface";
import { ICommunityEntity } from "../../../entities/models/community.entity";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { CustomError } from "../../../entities/utils/custom-error";
import { IAwsS3Service } from "../../../entities/services/awsS3-service.interface";
import { redisClient } from "../../../frameworks/redis/redis.client";
import logger from "../../../shared/utils/logger.utils";

@injectable()
export class GetAllCommunityUsecase implements IGetAllCommunityUsecase {
  constructor(
    @inject("ICommunityRepository")
    private communityRepository: ICommunityRepository,
    @inject("IAwsS3Service")
    private awsS3Service: IAwsS3Service
  ) {}

  private async resolveCachedImageUrl(type: "icon" | "cover", communityId: string, s3Key?: string): Promise<string | null> {
    if (!s3Key) {
      logger.info(`No ${type} s3Key found for community: ${communityId}`);
      return null;
    }

    const cacheKey = `community:${type}:${communityId}`;
    const cachedUrl = await redisClient.get(cacheKey);

    if (cachedUrl) {
      logger.info(`[CACHE HIT] ${type} URL for ${communityId} retrieved from Redis`);
      return cachedUrl;
    }

    logger.info(`[CACHE MISS] ${type} URL for ${communityId} - Fetching from S3`);
    const publicUrl = await this.awsS3Service.getPublicFileUrl(s3Key);
    await redisClient.setEx(cacheKey, 86400, publicUrl);
    logger.info(`[CACHE SET] ${type} URL for ${communityId} stored in Redis`);
    
    return publicUrl;
  }

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
        const iconImage = await this.resolveCachedImageUrl("icon", community._id as string, community.iconImage!);
        const coverImage = await this.resolveCachedImageUrl("cover", community._id as string, community.coverImage!);
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