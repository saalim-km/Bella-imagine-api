import { inject, injectable } from "tsyringe";
import { IUpdateVendorRequestUsecase } from "../../entities/usecaseInterfaces/admin/update-vendor-request-usecase.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { INotificationRepository } from "../../entities/repositoryInterfaces/common/notification-repository.interface";
import { INotificationEntity } from "../../entities/models/notification.entity";

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
        }else if(status === "reject") {
            console.log('rejected request');
            if(!rejectReason) {
                throw new Error('reject reason is required.')
            }

            await this.vendorRepository.updateVendorProfile(receiverId,{isVerified : 'reject'});
            const notification : INotificationEntity = {
                senderId : senderId,
                receiverId : receiverId,
                message : rejectReason,
            }
            await this.notificationRepository.save(notification)
            console.log('after creating notification');
        }
    }
}