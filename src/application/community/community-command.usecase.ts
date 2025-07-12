import { inject, injectable } from "tsyringe";
import { ICommunityCommandUsecase } from "../../domain/interfaces/usecase/community-usecase.interface";
import {
  CreateCommunityInput,
  JoinCommunityInput,
  LeaveCommunityInput,
  UpdateCommunityInput,
} from "../../domain/interfaces/usecase/types/community.types";
import { ICommunityRepository } from "../../domain/interfaces/repository/community.repository";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { config } from "../../shared/config/config";
import { IAwsS3Service } from "../../domain/interfaces/service/aws-service.interface";
import path from "path";
import { generateSlug } from "../../shared/utils/helper/slug-generator";
import { unlinkSync } from "fs";
import { UpdateQuery } from "mongoose";
import { ICommunity } from "../../domain/models/community";
import { ICategoryRepository } from "../../domain/interfaces/repository/category.repository";
import { ICommunityMemberRepository } from "../../domain/interfaces/repository/community.repository";

@injectable()
export class CommunityCommandUsecase implements ICommunityCommandUsecase {
  constructor(
    @inject("ICommunityRepository")
    private _communityRepository: ICommunityRepository,
    @inject("IAwsS3Service") private _awsS3Service: IAwsS3Service,
    @inject("ICategoryRepository")
    private _categoryRepository: ICategoryRepository,
    @inject("ICommunityMemberRepository")
    private _communityMemberRepo: ICommunityMemberRepository
  ) {}

  async createNewCommunity(input: CreateCommunityInput): Promise<void> {
    const { iconImage, coverImage, category } = input;

    // if cateogry not exits , community coulndt creat , cuz the community is based on some cateory
    const isCategoryExists = await this._categoryRepository.findById(category);
    if (!isCategoryExists) {
      throw new CustomError(
        ERROR_MESSAGES.CATEGORY_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    // edge cases
    const isCommunityExists = await this._communityRepository.findOne({
      name: input.name.trim(),
    });
    if (isCommunityExists) {
      throw new CustomError(
        ERROR_MESSAGES.COMMUNIY_EXISTS,
        HTTP_STATUS.CONFLICT
      );
    }

    const newCommunity = {
      name: input.name,
      category: category,
      description: input.description,
      rules: input.rules,
      isPrivate: input.isPrivate,
      isFeatured: input.isFeatured,
      slug: generateSlug(input.name),
      iconImage: "",
      coverImage: "",
    };
    if (iconImage) {
      const s3Key = `${config.s3.community}/${Date.now()}${path.extname(
        iconImage.originalname
      )}`;
      await this._awsS3Service.uploadFileToAws(s3Key, iconImage.path);
      newCommunity.iconImage = s3Key;
      unlinkSync(iconImage.path);
    }
    if (coverImage) {
      const s3Key = `${config.s3.community}/${Date.now()}${path.extname(
        coverImage.originalname
      )}`;
      await this._awsS3Service.uploadFileToAws(s3Key, coverImage.path);
      newCommunity.coverImage = s3Key;
      unlinkSync(coverImage.path);
    }

    await this._communityRepository.create(newCommunity);
  }

  async updateCommunity(input: UpdateCommunityInput): Promise<void> {
    const {
      _id,
      description,
      isFeatured,
      isPrivate,
      name,
      rules,
      coverImage,
      iconImage,
      category,
    } = input;

    const community = await this._communityRepository.findById(_id);
    if (!community) {
      throw new CustomError(
        ERROR_MESSAGES.COMMUNITY_NO_EXIST,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (community.name !== name.trim()) {
      const isCommWithSameNameExists = await this._communityRepository.findOne({
        name: name.trim(),
      });
      if (isCommWithSameNameExists) {
        throw new CustomError(
          ERROR_MESSAGES.COMMUNIY_EXISTS,
          HTTP_STATUS.CONFLICT
        );
      }
    }

    let dataToUpdate: UpdateQuery<ICommunity> = {};
    const slug = generateSlug(name);
    if (iconImage) {
      const isFileExists = await this._awsS3Service.isFileAvailableInAwsBucket(
        community.iconImage
      );
      if (isFileExists) {
        await this._awsS3Service.deleteFileFromAws(community.iconImage);
      }
      const s3Key = `${config.s3.community}/${Date.now()}${path.extname(
        iconImage.originalname
      )}`;
      await this._awsS3Service.uploadFileToAws(s3Key, iconImage.path);
      dataToUpdate.iconImage = s3Key;
    }
    if (coverImage) {
      const isFileExists = await this._awsS3Service.isFileAvailableInAwsBucket(
        community.coverImage
      );
      if (isFileExists) {
        await this._awsS3Service.deleteFileFromAws(community.coverImage);
      }
      const s3Key = `${config.s3.community}/${Date.now()}${path.extname(
        coverImage.originalname
      )}`;
      await this._awsS3Service.uploadFileToAws(s3Key, coverImage.path);
      dataToUpdate.coverImage = s3Key;
    }

    dataToUpdate = {
      ...dataToUpdate,
      slug: slug,
      name: name,
      category: category,
      description: description,
      rules: rules,
      isFeatured: isFeatured,
      isPrivate: isPrivate,
    };

    console.log("data to update", dataToUpdate);
    await this._communityRepository.update(_id, dataToUpdate);
  }

  async joinCommunity(input: JoinCommunityInput): Promise<void> {
    const { communityId, userId , role } = input;

    const [isCommunityExists, isAlreadyMember] = await Promise.all([
      this._communityRepository.findById(communityId),
      this._communityMemberRepo.findOne({
      userId: userId,
      communityId: communityId,
      }),
    ]);
    if (!isCommunityExists) {
      throw new CustomError(
      ERROR_MESSAGES.COMMUNITY_NO_EXIST,
      HTTP_STATUS.NOT_FOUND
      );
    }

    if (isAlreadyMember) {
      throw new CustomError(
      ERROR_MESSAGES.ALREADY_MEMBER,
      HTTP_STATUS.CONFLICT
      );
    }

    await Promise.all([
      this._communityMemberRepo.create({
        communityId: communityId,
        userId: userId,
        userType : role === 'client' ? 'Client' : 'Vendor'
      }),
      this._communityRepository.update(communityId, {
        $inc: { memberCount: 1 },
      }),
    ]);
  }

  async leaveCommunity(input: LeaveCommunityInput): Promise<void> {
    const { communityId, userId } = input;
    const isCommunityExists = await this._communityRepository.findById(
      communityId
    );
    if (!isCommunityExists) {
      throw new CustomError(
        ERROR_MESSAGES.COMMUNITY_NO_EXIST,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const communityMember = await this._communityMemberRepo.findOne({
      userId: userId,
      communityId: communityId,
    });
    if (!communityMember || !communityMember._id) {
      throw new CustomError(
        ERROR_MESSAGES.DIDNT_JOINED_COMMUNITY,
        HTTP_STATUS.NOT_FOUND
      );
    }

    await Promise.all([
      this._communityMemberRepo.delete(communityMember._id),
      this._communityRepository.update(communityId, {
        $inc: { memberCount: -1 },
      }),
    ]);
  }
}
