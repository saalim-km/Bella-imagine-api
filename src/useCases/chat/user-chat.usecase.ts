import { inject, injectable } from "tsyringe";
import { IUpdateUserOnlineStatus } from "../../entities/usecaseInterfaces/chat/user-chat-usecase.interface";
import { ERROR_MESSAGES, HTTP_STATUS, TRole } from "../../shared/constants";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { CustomError } from "../../entities/utils/custom-error";

@injectable()
export class UserChatUsecase implements IUpdateUserOnlineStatus {
    constructor(
        @inject("IClientRepository") private clientRepository : IClientRepository,
        @inject("IVendorRepository") private vendorRepository : IVendorRepository
    ){}
    async execute(userId: string, isOnline: boolean , userType : TRole): Promise<void> {
        if(!userId) {
            throw new CustomError(ERROR_MESSAGES.ID_NOT_PROVIDED,HTTP_STATUS.BAD_REQUEST)
        }

        if(userType === 'vendor') {
            await this.vendorRepository.updateOnlineStatus(userId , isOnline)
        }else if(userType === 'client') {
            await this.clientRepository.updateOnlineStatus(userId,isOnline);
        }else{
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE,HTTP_STATUS.BAD_REQUEST)
        }
    }
}