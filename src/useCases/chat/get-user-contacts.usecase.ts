import { inject, injectable } from "tsyringe";
import { IGetUserContactsUsecase } from "../../entities/usecaseInterfaces/chat/get-user-contacts-usecase.interface";
import { HTTP_STATUS, TRole } from "../../shared/constants";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { IClientEntity } from "../../entities/models/client.entity";

@injectable()
export class GetUserContactsUsecase implements IGetUserContactsUsecase {
    constructor(
        @inject('IBookingRepository') private bookingRepository : IBookingRepository
    ){}
    async execute(userId: string, userType: TRole): Promise<IVendorEntity[] | IClientEntity[] | null> {
        if(!userId ||  !userType) {
            throw new CustomError('userId and UserType not found',HTTP_STATUS.BAD_REQUEST);
        }

        
        return await this.bookingRepository.findContactsForChat(userId,userType);
    }
}