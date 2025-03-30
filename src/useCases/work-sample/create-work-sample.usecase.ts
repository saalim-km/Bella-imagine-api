import { inject, injectable } from "tsyringe";
import { ICreateWorkSampleUsecase } from "../../entities/usecaseInterfaces/vendor/create-work-sample-usecase.interface";
import { IWorkSampleRepository } from "../../entities/repositoryInterfaces/work-sample/work-sample-repository.interface";
import { IWorkSampleEntity } from "../../entities/models/work-sample.entity";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";

@injectable()
export class CreateWorkSampleUsecase implements ICreateWorkSampleUsecase {
    constructor(
        @inject("IWorkSampleRepository") private workSampleRepository : IWorkSampleRepository,
        @inject("IVendorRepository") private vendorRepository : IVendorRepository

    ){}

    async execute(data: Partial<IWorkSampleEntity> , vendorId : string): Promise<void> {
        const vendor = await this.vendorRepository.findById(vendorId);

        if(!vendor){
            throw new CustomError('no vendor found',HTTP_STATUS.BAD_REQUEST)
        }
        if(!data) {
            throw new CustomError("No worksample data provided",HTTP_STATUS.BAD_REQUEST)
        }
        const newWorkSample = await this.workSampleRepository.create(data)

        vendor?.workSamples.push(newWorkSample._id as string);
        await this.vendorRepository.updateVendorProfile(vendorId,vendor)
    }
}