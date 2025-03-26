import { inject, injectable } from "tsyringe";
import { ICreateServiceUsecase } from "../../entities/usecaseInterfaces/service/create-service-usecase.interface";
import { IServiceRepository } from "../../entities/repositoryInterfaces/service/service-repository.interface";
import { IServiceEntity } from "../../entities/models/service.entity";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";

@injectable()
export class CreateServiceUsecase implements ICreateServiceUsecase {
    constructor(
        @inject("IServiceRepository") private serviceRepository : IServiceRepository
    ){}

    async execute(data: Partial<IServiceEntity>, vendorId: string): Promise<void> {
        console.log('in CreateServiceUsecase');
        if (!data.serviceTitle) {
            throw new CustomError('Service name is required', HTTP_STATUS.BAD_REQUEST);
        }
        if(!vendorId) {
            throw new CustomError('Vendor Id is Required',HTTP_STATUS.BAD_REQUEST)
        }

        const existinService = await this.serviceRepository.findByServiceName(data.serviceTitle);
        console.log('existence service : ',existinService);
        if(existinService) {
            throw new CustomError('Service already exists',HTTP_STATUS.CONFLICT)
        }

        data.vendor = vendorId;
        console.log(data);
        await this.serviceRepository.create(data)
    }
}