import { inject, injectable } from "tsyringe";
import { ICreateCommunityMemberUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/create-community-member-usecase.interface";
import { ICommunityMemberRepository } from "../../../entities/repositoryInterfaces/community-contest/community-member-repository.interface";
import { ICommunityMemberEntity } from "../../../entities/models/community-members.entity";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/community-contest/community-repository.interface";

@injectable()
export class CreateCommunityMemberUsecase implements ICreateCommunityMemberUsecase {
    constructor(
        @inject('ICommunityMemberRepository') private communityMemberRepository : ICommunityMemberRepository,
    ){}

    async execute(dto: Partial<ICommunityMemberEntity>): Promise<void> {
        if(!dto.communityId || !dto.userId) {
            throw new CustomError(ERROR_MESSAGES.NO_SUCH_DATA,HTTP_STATUS.BAD_REQUEST);
        }

        await this.communityMemberRepository.create(dto)
    }
}