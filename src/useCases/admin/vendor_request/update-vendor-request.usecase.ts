import { inject, injectable } from "tsyringe";
import { IUpdateVendorRequestUsecase } from "../../../entities/usecaseInterfaces/admin/vendor_request/update-vendor-request-usecase.interface";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { INotificationRepository } from "../../../entities/repositoryInterfaces/common/notification-repository.interface";
import { INotificationEntity } from "../../../entities/models/notification.entity";
import { CustomError } from "../../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class UpdateVendorRequestUsecase implements IUpdateVendorRequestUsecase {
    constructor(
        @inject("IVendorRepository") private vendorRepository : IVendorRepository,
        @inject("INotificationRepository") private notificationRepository  : INotificationRepository
    ){}

    async execute(senderId: string,receiverId : string, status: "reject" | "accept", rejectReason?: string): Promise<void> {
        console.log(senderId,receiverId,status,rejectReason);
        const vendor = await this.vendorRepository.findById(receiverId);

        if(!vendor) {
            throw new Error('No vendor Found');
        }

        if(status === "accept") {
            console.log('accepted request');
            await this.vendorRepository.updateVendorProfile(receiverId,{isVerified : 'accept'});
            await this.notificationRepository.save({message : 'Congratulations! Your application has been approved. You can now access your dashboard and start receiving bookings' , receiverId : receiverId})
        }else if(status === "reject") {
            console.log('rejected request');
            if(!rejectReason) {
                throw new Error('reject reason is required.')
            }

            const vendor = await this.vendorRepository.findById(receiverId);

            if(!vendor) {
                throw new CustomError('No Vendor Found',HTTP_STATUS.BAD_REQUEST);
            }

            vendor.isVerified = 'reject';
            vendor.verificationDocument = '';
            await this.vendorRepository.updateVendorProfile(receiverId,vendor);
            const notification : INotificationEntity = {
                receiverId : receiverId,
                message : `Your application has been rejected. Reason: ${rejectReason}. For further details, please contact support`,
                }
            await this.notificationRepository.save(notification)
            console.log('after creating notification');
        }
    }
}