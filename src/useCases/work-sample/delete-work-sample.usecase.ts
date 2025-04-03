import { inject, injectable } from "tsyringe";
import { IDeleteWorkSampleUsecase } from "../../entities/usecaseInterfaces/vendor/delete-work-sample-usecase.interface";
import { IWorkSampleRepository } from "../../entities/repositoryInterfaces/work-sample/work-sample-repository.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";

@injectable()
export class DeleteWorkSampleUsecase implements IDeleteWorkSampleUsecase {
    constructor(
        @inject("IWorkSampleRepository") private workSampleReposiory : IWorkSampleRepository
    ){}

    async execute(workSampleId: string): Promise<void> {
        const isExistingWorkSample = await this.workSampleReposiory.findWorkSampleById(workSampleId);
        console.log('existing work sample : ',isExistingWorkSample);
        if(!isExistingWorkSample) {
            throw new CustomError('No Worksample found to delete',HTTP_STATUS.NOT_FOUND);
        }

        await this.workSampleReposiory.deleteWorkSampleById(workSampleId);
    }
}