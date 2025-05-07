import { inject, injectable } from "tsyringe";
import { IAwsS3Service } from "../../entities/services/awsS3-service.interface";
import { IUploadMediaChatUsecase } from "../../entities/usecaseInterfaces/chat/upload-media-chat-usecase.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";
import path from "path";
import { config } from "../../shared/config";
import { redisClient } from "../../frameworks/redis/redis.client";
import { unlinkSync } from "fs";

@injectable()
export class UploadMediaChatUsecase implements IUploadMediaChatUsecase {
    constructor(
        @inject("IAwsS3Service") private awsS3Service: IAwsS3Service
    ) {}

    async execute(file : Express.Multer.File , conversationId : string): Promise<{ key: string, mediaUrl: string}> {
        if(!file){
            throw new CustomError('File is required to upload media to s3',HTTP_STATUS.BAD_REQUEST);
        }

        const fileKey = `private-chat-media/${conversationId}/${Date.now()}${path.extname(file.originalname)}`;
        await this.awsS3Service.uploadFileToAws(fileKey, file.path);
        const mediaUrl = await this.awsS3Service.getFileUrlFromAws(fileKey, config.redis.REDIS_PRESIGNED_URL_EXPIRY);

        unlinkSync(file.path)
        
        // caching the media for future get requests
        await redisClient.setEx(fileKey, config.redis.REDIS_PRESIGNED_URL_EXPIRY, mediaUrl);

        return {key : fileKey , mediaUrl : mediaUrl}
    }
}