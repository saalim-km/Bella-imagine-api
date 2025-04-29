import { inject, injectable } from "tsyringe";
import { IDeleteCommunityUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/delete-community-usecase.interface";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/community-contest/community-repository.interface";

@injectable()
export class DeleteCommunityUsecase implements IDeleteCommunityUsecase {
    constructor(
        @inject('ICommunityRepository') private communityRepository : ICommunityRepository
    ){}

    async execute(communityId: string): Promise<void> {
        await this.communityRepository.delete(communityId)
    }
}