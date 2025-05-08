import { inject, injectable } from "tsyringe";
import { ICreateCommunityUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/create-community-usecase.interface";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/community-contest/community-repository.interface";
import { CustomError } from "../../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../../shared/constants";
import { generateSlug } from "../../../shared/utils/generate-slug.utils";
import { unlinkSync } from "fs";
import path from "path";
import { ICommunityEntity } from "../../../entities/models/community.entity";
import { CreateCommunityDto } from "../../../shared/types/community/community.types";
import { IAwsS3Service } from "../../../entities/services/awsS3-service.interface";

@injectable()
export class CreateCommunityUsecase implements ICreateCommunityUsecase {
    constructor(
        @inject('ICommunityRepository') private communityRepository: ICommunityRepository,
        @inject('IAwsS3Service') private awsS3Service: IAwsS3Service
    ) { }

    async execute(dto: CreateCommunityDto): Promise<void> {
        if (!dto.name || !dto.description || !dto.rules) {
            throw new CustomError("Didn't meet required fields to create a community", HTTP_STATUS.BAD_REQUEST);
        }

        const existingCommunity = await this.communityRepository.findByName(dto.name);
        if (existingCommunity) {
            throw new CustomError("Community with this name already exists", HTTP_STATUS.CONFLICT);
        }

        const newCommunity: Partial<ICommunityEntity> = {
            name: dto.name,
            description: dto.description,
            rules: dto.rules,
            isPrivate: dto.isPrivate,
            isFeatured: dto.isFeatured,
            slug: generateSlug(dto.name)
        };

        // Handle file uploads if they exist
        try {
            if (dto.files?.iconImage) {
                const iconImage = dto.files.iconImage;
                const s3Key = `community/${Date.now()}${path.extname(iconImage.originalname)}`;
                await this.awsS3Service.uploadFileToAws(s3Key, iconImage.path);
                newCommunity.iconImage = s3Key;
                unlinkSync(iconImage.path);
            }

            if (dto.files?.coverImage) {
                const coverImage = dto.files.coverImage;
                const s3Key = `community/${Date.now()}${path.extname(coverImage.originalname)}`;
                await this.awsS3Service.uploadFileToAws(s3Key, coverImage.path);
                newCommunity.coverImage = s3Key;
                unlinkSync(coverImage.path);
            }

            await this.communityRepository.create(newCommunity);
        } catch (error) {
            if (newCommunity.iconImage) {
                await this.awsS3Service.deleteFileFromAws(newCommunity.iconImage).catch(() => { });
            }
            if (newCommunity.coverImage) {
                await this.awsS3Service.deleteFileFromAws(newCommunity.coverImage).catch(() => { });
            }
            throw error;
        }
    }
}