import { inject, injectable } from "tsyringe";
import { IUpdateLastSeenUsecase } from "../../entities/usecaseInterfaces/chat/update-last-seen-usecase.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { ERROR_MESSAGES, TRole } from "../../shared/constants";

@injectable()
export class UpdateLastSeenUsecase implements IUpdateLastSeenUsecase {
    constructor(
        @inject("IClientRepository") private clientRepository : IClientRepository,
        @inject("IVendorRepository") private vendorRepository : IVendorRepository
    ){}

    async execute(userId: string, lastSeen: string, userType: TRole): Promise<void> {
        console.log('IN UPDATELASTSEEN USECASE--------------');
        if(!userId || !lastSeen || !userType) {
            throw new Error('Invalid data for updating last seen');
        }

        if(userType === 'client') {
            await this.clientRepository.updateLastSeen(userId,lastSeen);
        }else if(userType === 'vendor') {
            await this.vendorRepository.updateLastSeen(userId,lastSeen);
        }
    }
}