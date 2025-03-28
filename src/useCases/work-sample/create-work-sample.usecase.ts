import { inject, injectable } from "tsyringe";
import { ICreateWorkSampleUsecase } from "../../entities/usecaseInterfaces/vendor/create-work-sample-usecase.interface";
import { IWorkSampleRepository } from "../../entities/repositoryInterfaces/work-sample/work-sample-repository.interface";
import { IWorkSampleEntity } from "../../entities/models/work-sample.entity";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";

@injectable()
export class CreateWorkSampleUsecase implements ICreateWorkSampleUsecase {
    constructor(
        @inject("IWorkSampleRepository") private workSampleRepository : IWorkSampleRepository
    ){}

    async execute(data: Partial<IWorkSampleEntity>): Promise<void> {
        if(!data) {
            throw new CustomError("No worksample data provided",HTTP_STATUS.BAD_REQUEST)
        }
        await this.workSampleRepository.create(data)
    }
}