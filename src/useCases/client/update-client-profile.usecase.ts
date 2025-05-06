import { inject, injectable } from "tsyringe";
import { IUpdateClientUsecase } from "../../entities/usecaseInterfaces/client/update-client-profile-usecase.interface";
import { UpdateClientDto } from "../../shared/dtos/user.dto";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { redisClient } from "../../frameworks/redis/redis.client";
import { IAwsS3Service } from "../../entities/services/awsS3-service.interface";
import path from "path";

@injectable()
export class UpdateClientUsecase implements IUpdateClientUsecase {
    constructor(
        @inject("IClientRepository") private clientRepository: IClientRepository,
        @inject("IAwsS3Service") private awsS3Service: IAwsS3Service
    ) {}

    async excute(id: string, data: UpdateClientDto, file?: Express.Multer.File): Promise<void> {
        const client = await this.clientRepository.findById(id);
        if (!client) {
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.BAD_REQUEST);
        }

        if (file) {
            const fileKey = `profile-images/${id}/${Date.now()}${path.extname(file.originalname)}`;

            // Upload to S3
            await this.awsS3Service.uploadFileToAws(fileKey, file.path);

            // Always update the presigned URL since a new image was uploaded
            const presignedUrl = await this.awsS3Service.getFileUrlFromAws(fileKey, 86400);
            await redisClient.setEx(`profile-url:${id}`, 86400, presignedUrl);

            data.profileImage = fileKey;
        }

        if (data?.name !== undefined) client.name = data.name;
        if (data?.phoneNumber !== undefined) client.phoneNumber = data.phoneNumber;
        if (data?.profileImage !== undefined) client.profileImage = data.profileImage;
        if (data?.location !== undefined) client.location = data.location;

        await this.clientRepository.updateClientProfileById(id, client);
    }
}
