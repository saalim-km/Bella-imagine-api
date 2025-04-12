import { inject, injectable } from "tsyringe";
import { IDeleteContestUsecase } from "../../../entities/usecaseInterfaces/admin/contest/delete-contest-usecase.interface";
import { IContestRepository } from "../../../entities/repositoryInterfaces/contest/contest-repository.interface";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class DeleteContestUsecase implements IDeleteContestUsecase {
    constructor(
        @inject('IContestRepository') private contestRepository : IContestRepository
    ){}

    async execute(contestId: string): Promise<void> {
        if(!contestId) {
            throw new CustomError(ERROR_MESSAGES.ID_REQUIRED,HTTP_STATUS.BAD_REQUEST)
        }

        const isExistsContest = await this.contestRepository.findById(contestId);
        if(!isExistsContest) {
            throw new CustomError(ERROR_MESSAGES.CONTEST_NOT_FOUND,HTTP_STATUS.BAD_REQUEST)
        }

        await this.contestRepository.findByIdDeleteContest(contestId)
    }
}