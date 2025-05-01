import { inject, injectable } from "tsyringe";
import { ILeaveCommunityUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/leave-community-usecase.interface";
import { ICommunityMemberRepository } from "../../../entities/repositoryInterfaces/community-contest/community-member-repository.interface";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/community-contest/community-repository.interface";

@injectable()
export class LeaveCommunityUsecase implements ILeaveCommunityUsecase {
    constructor(
        @inject('ICommunityMemberRepository') private communityMemberRepository : ICommunityMemberRepository,
        @inject('ICommunityRepository') private communityRepository: ICommunityRepository
    ){}

    async execute(communityId: string, userId: string): Promise<void> {
        if(!communityId || !userId){
            throw new CustomError(ERROR_MESSAGES.NO_SUCH_DATA,HTTP_STATUS.BAD_REQUEST)
        }

        const isCommunityExists = await this.communityRepository.findById(communityId);
        if(!isCommunityExists){
            throw new CustomError(ERROR_MESSAGES.COMMUNITY_NO_EXIST, HTTP_STATUS.BAD_REQUEST)
        }

        await this.communityMemberRepository.deleteMember(communityId,userId)
    }
}