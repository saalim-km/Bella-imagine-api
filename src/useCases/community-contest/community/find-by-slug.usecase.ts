import { inject, injectable } from "tsyringe";
import { IFindCommunityBySlugUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/find-by-slug-usecase.interface";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/community-contest/community-repository.interface";
import { ICommunityEntity } from "../../../entities/models/community.entity";
import { CustomError } from "../../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class FindCommunityBySlugUsecase implements IFindCommunityBySlugUsecase {
    constructor(
        @inject('ICommunityRepository') private communityRepository : ICommunityRepository
    ){}

    async execute(slug: string): Promise<ICommunityEntity | null> {
        if(!slug) {
            throw new CustomError('Slug is required',HTTP_STATUS.BAD_REQUEST);
        }
        return await this.communityRepository.findBySlug(slug);
    }
}