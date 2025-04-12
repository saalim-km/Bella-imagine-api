import { inject, injectable } from "tsyringe";
import { ICreateContestUsecase } from "../../../entities/usecaseInterfaces/admin/contest/create-contest-usecase.interface";
import { IContest } from "../../../entities/models/contenst.entity";
import { IContestRepository } from "../../../entities/repositoryInterfaces/contest/contest-repository.interface";
import { ICategoryRepository } from "../../../entities/repositoryInterfaces/common/category-repository.interface";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class CreateContestUsecase implements ICreateContestUsecase {
    constructor(
        @inject('IContestRepository') private contestRepository : IContestRepository,
        @inject('ICategoryRepository') private categoryRepository : ICategoryRepository

    ){}
    async execute(data: Partial<IContest>): Promise<void> {
        const isContestAlreadyExist = await this.contestRepository.findByTitle(data.title!);

        if(isContestAlreadyExist){
            throw new CustomError(ERROR_MESSAGES.ALREADY_EXISTS,HTTP_STATUS.BAD_REQUEST)
        }

        const isCategoryExist = await this.categoryRepository.findById(data.categoryId);

        if(!data.title || !data.contestType || !data.description || !data.startDate || !data.endDate || !data.categoryId) {
            throw new CustomError(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS, HTTP_STATUS.BAD_REQUEST)
        }
        if(!isCategoryExist) {
            throw new CustomError(ERROR_MESSAGES.CATEGORY_NOT_FOUND,HTTP_STATUS.BAD_REQUEST)
        }

        const now = new Date();

        if(data.startDate < now) {
            throw new CustomError('StartDate must be in the future and cannot be a past date', HTTP_STATUS.BAD_REQUEST)
        }

        if(data.endDate < data.startDate) {
            throw new CustomError('EndDate must be greater than StartDate', HTTP_STATUS.BAD_REQUEST)
        }

        await this.contestRepository.create(data)
    }
}