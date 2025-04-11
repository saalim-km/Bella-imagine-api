import { inject, injectable } from "tsyringe";
import { IUpdateUserStatusUsecase } from "../../entities/usecaseInterfaces/admin/update-user-usecase.interface";
import { TRole } from "../../shared/constants";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";

@injectable()
export class UpdateUserStatusUsecase implements IUpdateUserStatusUsecase {
    constructor(
        @inject("IVendorRepository") private vendorRepository : IVendorRepository,
        @inject("IClientRepository") private clientRepository : IClientRepository,

    ){}
    async execute(userType: TRole, userId: string): Promise<void> {
        if(userType === 'vendor'){
            console.log('user type is vendor');
            const vendor = await this.vendorRepository.findById(userId)

            const newStatus = vendor?.isblocked ? false : true;
            await this.vendorRepository.updateVendorProfile(userId,{isblocked : newStatus})
            
        }else if(userType === 'client') {
            console.log('user type is client');
            console.log(userType,userId);
            const client = await this.clientRepository.findById(userId);

            const newStatus = client?.isblocked ? false : true;
            console.log('new status : ',newStatus);
            const res = await this.clientRepository.updateClientProfileById(userId,{isblocked : newStatus})
            console.log(res);
        }
    }
}