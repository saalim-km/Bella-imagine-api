import { IAwsS3Service } from "../../entities/services/awsS3-service.interface";
import { getCachedSignedS3Url as baseGetCachedSignedS3Url } from "./s3-url-cache.utils";

export function createS3UrlCache(awsS3Service: IAwsS3Service) {
  return {
    getCachedSignUrl: (objectKey: string) =>
      baseGetCachedSignedS3Url(objectKey, awsS3Service),
  };
}
