import { inject, injectable } from "tsyringe";
import { IUpdateCommunityUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/update-community-usecase.interface";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/community-contest/community-repository.interface";
import { CustomError } from "../../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../../shared/constants";
import { generateSlug } from "../../../shared/utils/generate-slug.utils";
import { unlinkSync } from "fs";
import path from "path";
import { UpdateCommunityDto } from "../../../shared/types/community/community.types";
import { IAwsS3Service } from "../../../entities/services/awsS3-service.interface";
import { config } from "../../../shared/config";

@injectable()
export class UpdateCommunityUsecase implements IUpdateCommunityUsecase {
  constructor(
    @inject("ICommunityRepository")
    private communityRepository: ICommunityRepository,
    @inject("IAwsS3Service") private awsS3Service: IAwsS3Service
  ) {}

  async execute(dto: UpdateCommunityDto): Promise<void> {
    const existingCommunity = await this.communityRepository.findById(dto._id);
    if (!existingCommunity) {
      throw new CustomError("Community not found", HTTP_STATUS.NOT_FOUND);
    }

    const updatedCommunity: any = {};

    if (dto.name && dto.name !== existingCommunity.name) {
      const nameExists = await this.communityRepository.findByName(dto.name);
      if (nameExists && nameExists._id?.toString() !== dto._id) {
        throw new CustomError(
          "Another community with this name already exists",
          HTTP_STATUS.CONFLICT
        );
      }
      updatedCommunity.name = dto.name;
      updatedCommunity.slug = generateSlug(dto.name);
    }

    if (dto.description) updatedCommunity.description = dto.description;
    if (dto.rules) updatedCommunity.rules = dto.rules;
    if (dto.isPrivate !== undefined) updatedCommunity.isPrivate = dto.isPrivate;
    if (dto.isFeatured !== undefined)
      updatedCommunity.isFeatured = dto.isFeatured;

    try {
      if (dto.files?.iconImage) {
        const iconImage = dto.files.iconImage;
        const s3Key = `${config.s3.community}/${Date.now()}${path.extname(
          iconImage.originalname
        )}`;
        await this.awsS3Service.uploadFileToAws(s3Key, iconImage.path);
        updatedCommunity.iconImage = s3Key;
        unlinkSync(iconImage.path);

        if (existingCommunity.iconImage) {
          await this.awsS3Service
            .deleteFileFromAws(existingCommunity.iconImage)
            .catch(() => {});
        }
      }

      if (dto.files?.coverImage) {
        const coverImage = dto.files.coverImage;
        const s3Key = `${config.s3.community}/${Date.now()}${path.extname(
          coverImage.originalname
        )}`;
        await this.awsS3Service.uploadFileToAws(s3Key, coverImage.path);
        updatedCommunity.coverImage = s3Key;
        unlinkSync(coverImage.path);

        if (existingCommunity.coverImage) {
          await this.awsS3Service.deleteFileFromAws(existingCommunity.coverImage)
        }
      }

      await this.communityRepository.updateCommunity(dto._id, updatedCommunity);
    } catch (error) {
      if (updatedCommunity.iconImage) {
        await this.awsS3Service.deleteFileFromAws(updatedCommunity.iconImage)
      }
      if (updatedCommunity.coverImage) {
        await this.awsS3Service.deleteFileFromAws(updatedCommunity.coverImage)
      }
      throw error;
    }
  }
}
