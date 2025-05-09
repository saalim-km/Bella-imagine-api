import { inject, injectable } from "tsyringe";
import { IUpdateClientUsecase } from "../../entities/usecaseInterfaces/client/update-client-profile-usecase.interface";
import { UpdateClientDto } from "../../shared/dtos/user.dto";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { redisClient } from "../../frameworks/redis/redis.client";
import { IAwsS3Service } from "../../entities/services/awsS3-service.interface";
import path from "path";
import { config } from "../../shared/config";
import { s3UrlCache } from "../../frameworks/di/resolver";
import { unlinkSync } from "fs";
import logger from "../../shared/logger/logger.utils";

@injectable()
export class UpdateClientUsecase implements IUpdateClientUsecase {
    constructor(
        @inject("IClientRepository") private clientRepository: IClientRepository,
        @inject("IAwsS3Service") private awsS3Service: IAwsS3Service
    ) {}

    async excute(id: string, data: UpdateClientDto, file?: Express.Multer.File): Promise<void> {
        logger.info('in the updatecient usecase : ')
        console.log(file);
        console.log(data,id);
        const client = await this.clientRepository.findById(id);
        if (!client) {
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.BAD_REQUEST);
        }

        if (file) {
            // delete existing object form s3 before uploading the new image
            const isFileExists = await this.awsS3Service.isFileAvailableInAwsBucket(client.profileImage!);
            if(isFileExists){
                await this.awsS3Service.deleteFileFromAws(client.profileImage!);        
            }
            
            const fileKey = `${config.s3.profile}/${id}/${Date.now()}${path.extname(file.originalname)}`;

            // Upload to S3
            await this.awsS3Service.uploadFileToAws(fileKey, file.path);
            try {
                unlinkSync(file.path)
            } catch (error) {
                logger.warn('failed to delete file')
            }

            // Always update the presigned URL since a new image was uploaded
            await s3UrlCache.getCachedSignUrl(fileKey)

            data.profileImage = fileKey;
        }

        if (data?.name !== undefined) client.name = data.name;
        if (data?.phoneNumber !== undefined) client.phoneNumber = data.phoneNumber;
        if (data?.profileImage !== undefined) client.profileImage = data.profileImage;
        if (data?.location !== undefined) client.location = data.location;

        await this.clientRepository.updateClientProfileById(id, client);
    }
}
