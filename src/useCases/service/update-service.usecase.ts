import { inject, injectable } from "tsyringe";
import { IUpdateServiceUsecase } from "../../entities/usecaseInterfaces/service/update-service-usecase.interface";
import { IServiceRepository } from "../../entities/repositoryInterfaces/service/service-repository.interface";
import { IServiceEntity } from "../../entities/models/service.entity";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";

@injectable()
export class UpdateServiceUsecase implements IUpdateServiceUsecase {
    constructor(
        @inject("IServiceRepository") private serviceRepository : IServiceRepository
    ){}

    async execute(data: IServiceEntity): Promise<void> {
        console.log('in UpdateServiceUsecase',data);
        console.log(data.location);
        console.log(data._id);
        if(!data){
            throw new CustomError("Data for updating service is missing",HTTP_STATUS.BAD_REQUEST);
        }

        const serviceId = data._id;

        if(!serviceId) {
            throw new Error("no id found")
        }

        await this.serviceRepository.update(serviceId,data);
    }
}