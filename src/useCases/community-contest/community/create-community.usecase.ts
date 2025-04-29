import { inject, injectable } from "tsyringe";
import { ICreateCommunityUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/create-community-usecase.interface";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/community-contest/community-repository.interface";
import { ICommunityEntity } from "../../../entities/models/community.entity";
import { CustomError } from "../../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class CreateCommunityUsecase implements ICreateCommunityUsecase {
    constructor(
        @inject('ICommunityRepository') private communityRepository : ICommunityRepository
    ){}

    async execute(dto: Partial<ICommunityEntity>): Promise<void> {
        if(!dto.name || !dto.description || !dto.rules) {
            throw new CustomError("Didn't meet required fields to create a community",HTTP_STATUS.BAD_REQUEST)
        }

        await this.communityRepository.create(dto);
    }
}