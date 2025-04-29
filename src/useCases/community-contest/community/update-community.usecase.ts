import { inject, injectable } from "tsyringe";
import { IUpdateCommunityUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/update-community-usecase.interface";
import { ICommunityEntity } from "../../../entities/models/community.entity";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/community-contest/community-repository.interface";
import { generateSlug } from "../../../shared/utils/generate-slug.utils";

@injectable()
export class UpdateCommunityUsecase implements IUpdateCommunityUsecase {
    constructor(
        @inject('ICommunityRepository') private communityRepository : ICommunityRepository
    ) {}

    async execute(communityId: string, dto: Partial<ICommunityEntity>): Promise<void> {
        let newSlug : string;
        if(!communityId || !dto.slug || !dto.name) {
            throw new CustomError(ERROR_MESSAGES.NO_SUCH_DATA,HTTP_STATUS.BAD_REQUEST);
        }
        dto.slug = generateSlug(dto.name);
        await this.communityRepository.updateCommunity(communityId,dto)
    }
}