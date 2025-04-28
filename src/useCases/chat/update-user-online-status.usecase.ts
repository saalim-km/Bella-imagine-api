import { inject, injectable } from "tsyringe";
import { IUpdateUserOnlineStatusUsecase } from "../../entities/usecaseInterfaces/chat/update-user-online-status-usecase.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { ERROR_MESSAGES, HTTP_STATUS, TRole } from "../../shared/constants";
import { CustomError } from "../../entities/utils/custom-error";

@injectable()
export class UpdateUserOnlineStatusUsecase implements IUpdateUserOnlineStatusUsecase {
    constructor(
        @inject("IClientRepository") private clientRepository : IClientRepository,
        @inject("IVendorRepository") private vendorRepository : IVendorRepository
    ){}

    async execute(userId: string, userType: TRole , status : true | false): Promise<void> {
        console.log('--------------------in update user online status -----------------');
        console.log(userId,userType,status);
        if(!userId || !userType) {
            throw new CustomError('Not such details for updating online status',HTTP_STATUS.BAD_REQUEST)
        }

        if(userType === "client") {
            console.log('usertype is client',userId);
            const isUserExists = await this.clientRepository.findById(userId)
            if(!isUserExists) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
            await this.clientRepository.findByIdAndUpdateOnlineStatus(userId,status)
        }else if(userType === 'vendor') {
            console.log('usertype is vendor',userId);
            const isUserExists = await this.vendorRepository.findById(userId)
            if(!isUserExists) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
            await this.vendorRepository.findByIdAndUpdateOnlineStatus(userId,status)
        }
    }
}