import { inject, injectable } from "tsyringe";
import { IGetServiceUsecase } from "../../entities/usecaseInterfaces/client/get-service-usecase.interaface";
import { IServiceRepository } from "../../entities/repositoryInterfaces/service/service-repository.interface";
import { IServiceEntity } from "../../entities/models/service.entity";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";

@injectable()
export class GetServiceUsecase implements IGetServiceUsecase {
    constructor(
        @inject("IServiceRepository") private serviceRepository : IServiceRepository
    ){}

    async execute(serviceId: string): Promise<IServiceEntity> {
        const service =  await this.serviceRepository.findById(serviceId)

        if(!service) {
            throw new CustomError('No Service found',HTTP_STATUS.BAD_REQUEST);
        }

        return service;
    }
}