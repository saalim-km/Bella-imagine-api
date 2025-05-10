import { inject, injectable } from "tsyringe";
import { IFindCommunityBySlugUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/find-by-slug-usecase.interface";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/community-contest/community-repository.interface";
import { ICommunityEntity } from "../../../entities/models/community.entity";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { ICommunityMemberRepository } from "../../../entities/repositoryInterfaces/community-contest/community-member-repository.interface";
import { s3UrlCache } from "../../../frameworks/di/resolver";

@injectable()
export class FindCommunityBySlugUsecase implements IFindCommunityBySlugUsecase {
    constructor(
        @inject('ICommunityRepository') private communityRepository : ICommunityRepository,
        @inject('ICommunityMemberRepository') private communityMemberRepository : ICommunityMemberRepository
    ){}

    async execute(slug: string  , userId ?: string): Promise<{community : ICommunityEntity , isMember : boolean}> {
        if(!slug) {
            throw new CustomError('Slug is required',HTTP_STATUS.BAD_REQUEST);
        }

        const community = await this.communityRepository.findBySlug(slug);

        if(!community){
            throw new CustomError(ERROR_MESSAGES.COMMUNITY_NO_EXIST,HTTP_STATUS.NOT_FOUND,)
        }

        if(community.iconImage){
            const cachedUrl = await s3UrlCache.getCachedSignUrl(community.iconImage);
            community.iconImage = cachedUrl
        }

        if(community.coverImage){
            const cachedUrl = await s3UrlCache.getCachedSignUrl(community.coverImage);
            community.coverImage = cachedUrl
        }
        
        console.log('got the userid and community id : ',userId,community?._id);
        let isMember = false;
        if(userId && community?._id) { 
            console.log(userId,community);
            isMember = await this.communityMemberRepository.isMember(community?._id as string,userId)
        }
        
        return {
            community : community as ICommunityEntity,
            isMember : isMember as boolean
        }
    }
}