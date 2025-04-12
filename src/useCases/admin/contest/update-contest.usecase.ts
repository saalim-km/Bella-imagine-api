import { inject, injectable } from "tsyringe";
import { IUpdateContestUsecase } from "../../../entities/usecaseInterfaces/admin/contest/update-contest-usecase.interface";
import { IContestRepository } from "../../../entities/repositoryInterfaces/contest/contest-repository.interface";
import { IContest } from "../../../entities/models/contenst.entity";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class UpdateContestUsecase implements IUpdateContestUsecase {
  constructor(
    @inject("IContestRepository") private contestRepository: IContestRepository
  ) {}

  async execute(contestId: string, data: Partial<IContest>): Promise<void> {
    if (!contestId) {
      throw new CustomError(
        ERROR_MESSAGES.ID_REQUIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const isExistsContest = await this.contestRepository.findById(contestId);
    if (!isExistsContest) {
      throw new CustomError(
        ERROR_MESSAGES.CONTEST_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (data.startDate && data.endDate) {
      if (data.startDate > data.endDate) {
        throw new CustomError(
          "StartDate cannot be greater than EndDate",
          HTTP_STATUS.BAD_REQUEST
        );
      } else if (data.endDate < data.startDate) {
        throw new CustomError(
          "EndDate must be greater than StartDate",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    if (data.startDate) {
      if (data.startDate > isExistsContest.endDate) {
        throw new CustomError(
          "StartDate cannot be greater than EndDate",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    if (data.endDate) {
      if (data.endDate < isExistsContest.startDate) {
        throw new CustomError(
          "EndDate must be greater than StartDate",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    await this.contestRepository.findByIdAndUpdateContest(contestId, data);
  }
}
