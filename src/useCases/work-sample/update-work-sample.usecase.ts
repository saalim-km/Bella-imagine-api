import { inject, injectable } from "tsyringe";
import { IUpdateWorkSampleUsecase } from "../../entities/usecaseInterfaces/vendor/update-work-sample-usecase.interface";
import { IWorkSampleRepository } from "../../entities/repositoryInterfaces/work-sample/work-sample-repository.interface";
import { IWorkSampleEntity } from "../../entities/models/work-sample.entity";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";

@injectable()
export class UpdateWorkSampleUsecase implements IUpdateWorkSampleUsecase {
    constructor(
        @inject("IWorkSampleRepository") private workSampleRepository : IWorkSampleRepository
    ){}

    async execute(workSampleId: string, payload: Partial<IWorkSampleEntity>): Promise<void> {
        if(!workSampleId) {
            throw new CustomError('Id is required for udpateing work sample',HTTP_STATUS.BAD_REQUEST);
        }

        await this.workSampleRepository.updateWorkSampleById(workSampleId,payload);
    }
}