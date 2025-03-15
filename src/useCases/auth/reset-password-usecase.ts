import { inject, injectable } from "tsyringe";
import { IResetPasswordUsecase } from "../../entities/usecaseIntefaces/auth/reset-password-usecase.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { TRole } from "../../shared/constants";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { PasswordBcrypt } from "../../frameworks/security/password.bcrypt";

@injectable()
export class ResetPasswordUsecase implements IResetPasswordUsecase {
    constructor(
        @inject("IClientRepository") private clientRepository : IClientRepository,
        @inject("IVendorRepository") private vendorRepository : IVendorRepository,
        @inject("PasswordBcrypt") private passBcrypt : IBcrypt
    ){}

    async execute({ email, userType, newPassword }: { email: string; userType: TRole; newPassword: string; }): Promise<void> {
        console.log('-------------------------ResetPasswordUsecase--------------------------');
        if(userType === 'vendor') {
            const hashedPassword = await this.passBcrypt.hash(newPassword);
            console.log('hashed password : ',hashedPassword);
            const vendor = await this.vendorRepository.findByEmail(email);
            console.log(vendor);
            if(!vendor || !vendor._id) {
                throw new Error('No vendor found')
            }

            const userId = vendor._id.toString()
            await this.vendorRepository.updateVendorPassword(userId, hashedPassword);
        }else if(userType === 'client') {
            const hashedPassword = await this.passBcrypt.hash(newPassword);
            console.log(hashedPassword);
            const client = await this.clientRepository.findByEmail(email);
            console.log(client);
            if(!client || !client._id) {
                throw new Error('No client found')
            }

            const userId = client._id.toString()
            await this.clientRepository.findByIdAndUpdatePassword(userId, hashedPassword);
        }
    }
}