import { inject, injectable } from "tsyringe";
import { IGetClientDetailsUsecase } from "../../entities/usecaseInterfaces/client/get-client-details-usecase.interface";
import { IClientEntity } from "../../entities/models/client.entity";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { IAwsS3Service } from "../../entities/services/awsS3-service.interface";
import { redisClient } from "../../frameworks/redis/redis.client";
import logger from "../../shared/logger/logger.utils";
import { config } from "../../shared/config";

@injectable()
export class GetClientDetailsUsecase implements IGetClientDetailsUsecase {
    constructor(
        @inject("IClientRepository") private clientRepository: IClientRepository,
        @inject("IAwsS3Service") private awsS3Service: IAwsS3Service
    ) {}

    async execute(id: any): Promise<IClientEntity | null> {
        if (!id) {
            throw new Error("id is required");
        }

        const data = await this.clientRepository.findById(id);
        if (data?.profileImage) {
            const cachedUrl = await redisClient.get(`profile-url:${id}`);
            if (cachedUrl) {
                logger.info('client profile was cacehd : ')
                console.log(cachedUrl);
                data.profileImage = cachedUrl;
            } else {
                const isFileAvailable = await this.awsS3Service.isFileAvailableInAwsBucket(data.profileImage);
                if (isFileAvailable) {
                    const presignedUrl = await this.awsS3Service.getFileUrlFromAws(data.profileImage, config.redis.REDIS_PRESIGNED_URL_EXPIRY);
                    data.profileImage = presignedUrl;
                    await redisClient.setEx(`profile-url:${id}`, config.redis.REDIS_PRESIGNED_URL_EXPIRY, presignedUrl);
                }
            }
        }

        console.log("in the GetClientDetailsUsecase : ", data);
        return data;
    }
}
