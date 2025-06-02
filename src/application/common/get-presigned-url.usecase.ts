import { inject, injectable } from "tsyringe";
import { IGetPresignedUrlUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { IAwsS3Service } from "../../domain/interfaces/service/aws-service.interface";
import { IRedisService } from "../../domain/interfaces/service/redis-service.interface";
import logger from "../../shared/logger/logger";
const DEFAULT_TTL = 86400;

@injectable()
export class GetPresignedUrlUsecase implements IGetPresignedUrlUsecase {
  constructor(
    @inject("IAwsS3Service") private _awsService: IAwsS3Service,
    @inject("IRedisService") private _redisService: IRedisService
  ) {}

  async getPresignedUrl(
    objectKey: string,
    ttlSecond: number = DEFAULT_TTL
  ): Promise<string> {
    const cacheKey = `s3:signed-url:${objectKey}`;

    try {
      // 1. Try Redis cache first
      const cachedUrl = await this._redisService.get(cacheKey);
      if (cachedUrl) {
        logger.info(`[Cache Hit] for ${objectKey}`);
        return cachedUrl;
      }

      // 2. Check if file exists in S3
      const isAvailable = await this._awsService.isFileAvailableInAwsBucket(
        objectKey
      );
      if (!isAvailable) {
        logger.warn(`[S3 File Missing] ${objectKey}`);
        return ""; // or throw new Error('File not found in S3');
      }

      // 3. Generate new signed URL
      const signedUrl = await this._awsService.getFileUrlFromAws(
        objectKey,
        ttlSecond
      );

      // 4. Cache the signed URL if generated
      if (signedUrl) {
        await this._redisService.set(cacheKey, signedUrl, ttlSecond);
      }

      return signedUrl;
    } catch (err) {
      logger.error(`[S3 URL Cache Error] ${objectKey}`, err);
      throw err;
    }
  }
}
