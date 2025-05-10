import { IAwsS3Service } from '../../entities/services/awsS3-service.interface';
import { redisClient } from '../../frameworks/redis/redis.client';
import logger from '../logger/logger.utils';

const DEFAULT_TTL = 86400; // 1 day

export async function getCachedSignedS3Url(
  objectKey: string,
  awsS3Service: IAwsS3Service,
  ttlSeconds: number = DEFAULT_TTL
): Promise<string> {
  const cacheKey = `s3:signed-url:${objectKey}`;

  try {
    // 1. Try Redis cache first
    const cachedUrl = await redisClient.get(cacheKey);
    if (cachedUrl) {
      logger.info(`[Cache Hit] for ${objectKey}`);
      return cachedUrl;
    }

    // 2. Check if file exists in S3
    const isAvailable = await awsS3Service.isFileAvailableInAwsBucket(objectKey);
    if (!isAvailable) {
      logger.warn(`[S3 File Missing] ${objectKey}`);
      return ''; // or throw new Error('File not found in S3');
    }

    // 3. Generate new signed URL
    const signedUrl = await awsS3Service.getFileUrlFromAws(objectKey, ttlSeconds);

    // 4. Cache the signed URL if generated
    if (signedUrl) {
      await redisClient.set(cacheKey, signedUrl, { EX: ttlSeconds });
    }

    return signedUrl;
  } catch (err) {
    logger.error(`[S3 URL Cache Error] ${objectKey}`, err);
    throw err;
  }
}
