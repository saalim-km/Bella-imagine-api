import { inject, injectable } from "tsyringe";
import { ICommunityCommandUsecase } from "../../domain/interfaces/usecase/community-usecase.interface";
import { CreateCommunityInput, UpdateCommunityInput } from "../../domain/interfaces/usecase/types/community.types";
import { ICommunityRepository } from "../../domain/interfaces/repository/community.repository";
import { CustomError } from "../../shared/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { config } from "../../shared/config/config";
import { IAwsS3Service } from "../../domain/interfaces/service/aws-service.interface";
import path from "path";
import { generateSlug } from "../../shared/utils/slug-generator";
import { unlinkSync } from "fs";
import { UpdateQuery } from "mongoose";
import { ICommunity } from "../../domain/models/community";

@injectable()
export class CommunityCommandUsecase implements ICommunityCommandUsecase {
    constructor(
        @inject('ICommunityRepository') private _communityRepository : ICommunityRepository,
        @inject('IAwsS3Service') private _awsS3Service : IAwsS3Service
    ){}

    async createNewCommunity(input: CreateCommunityInput): Promise<void> {
        const {iconImage , coverImage} = input;

        const isCommunityExists = await this._communityRepository.findOne({name : input.name.trim()})
        if(isCommunityExists){
            throw new CustomError(ERROR_MESSAGES.COMMUNIY_EXISTS,HTTP_STATUS.CONFLICT)
        }

        let newCommunity = {
            name : input.name,
            description: input.description,
            rules: input.rules,
            isPrivate: input.isPrivate,
            isFeatured: input.isFeatured,
            slug: generateSlug(input.name),
            iconImage : '',
            coverImage : ''
        }
        if(iconImage){
            const s3Key = `${config.s3.community}/${Date.now()}${path.extname(iconImage.originalname)}`;
            await this._awsS3Service.uploadFileToAws(s3Key, iconImage.path);
            newCommunity.iconImage = s3Key;
            unlinkSync(iconImage.path);
        }
        if(coverImage) {
            const s3Key = `${config.s3.community}/${Date.now()}${path.extname(coverImage.originalname)}`;
            await this._awsS3Service.uploadFileToAws(s3Key, coverImage.path);
            newCommunity.coverImage = s3Key;
            unlinkSync(coverImage.path);
        }

        await this._communityRepository.create(newCommunity)
    }

    async updateCommunity(input: UpdateCommunityInput): Promise<void> {
        const {_id , description , isFeatured,isPrivate,name,rules,coverImage,iconImage} = input;

        let community = await this._communityRepository.findById(_id);
        if(!community) {
            throw new CustomError(ERROR_MESSAGES.COMMUNITY_NO_EXIST,HTTP_STATUS.NOT_FOUND)
        }

        if(community.name !== name.trim()){
            const isCommWithSameNameExists = await this._communityRepository.findOne({name : name.trim()})
            if(isCommWithSameNameExists){
                throw new CustomError(ERROR_MESSAGES.COMMUNIY_EXISTS,HTTP_STATUS.CONFLICT)
            }
        }

        let dataToUpdate : UpdateQuery<ICommunity> = {}
        const slug = generateSlug(name)
        if(iconImage) {
            const isFileExists = await this._awsS3Service.isFileAvailableInAwsBucket(community.iconImage)
            if(isFileExists){
                await this._awsS3Service.deleteFileFromAws(community.iconImage)
            }
            const s3Key = `${config.s3.community}/${Date.now()}${path.extname(iconImage.originalname)}`;
            await this._awsS3Service.uploadFileToAws(s3Key,iconImage.path);
            dataToUpdate.iconImage = s3Key;
        }if(coverImage){
            const isFileExists = await this._awsS3Service.isFileAvailableInAwsBucket(community.coverImage)
            if(isFileExists){
                await this._awsS3Service.deleteFileFromAws(community.coverImage)
            }
            const s3Key = `${config.s3.community}/${Date.now()}${path.extname(coverImage.originalname)}`;
            await this._awsS3Service.uploadFileToAws(s3Key,coverImage.path);
            dataToUpdate.coverImage = s3Key;
        }

        dataToUpdate = {
            ...dataToUpdate,
            slug : slug,
            name : name,
            description : description,
            rules : rules,
            isFeatured : isFeatured,
            isPrivate : isPrivate
        }

        console.log('data to update',dataToUpdate);
        await this._communityRepository.update(_id,dataToUpdate)
    }
}