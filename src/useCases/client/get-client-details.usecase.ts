import { inject, injectable } from "tsyringe";
import { IGetClientDetailsUsecase } from "../../entities/usecaseInterfaces/client/get-client-details-usecase.interface";
import { IClientEntity } from "../../entities/models/client.entity";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";

@injectable()
export class GetClientDetailsUsecase implements IGetClientDetailsUsecase {
    constructor(
        @inject("IClientRepository") private clientRepository : IClientRepository
    ){}
    async execute(id: any): Promise<IClientEntity | null> {
        if(!id) {
            throw new Error('id is required');
        }

        return await this.clientRepository.findById(id)
    }
}