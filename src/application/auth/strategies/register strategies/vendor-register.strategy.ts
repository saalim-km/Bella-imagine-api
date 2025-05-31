import { inject, injectable } from "tsyringe";
import { IRegisterUserStrategy, } from "../../../../domain/interfaces/usecase/auth-usecase.interfaces";
import { IWalletRepository } from "../../../../domain/interfaces/repository/wallet-repository";
import { RegisterUserInput } from "../../auth.types";
import { CustomError } from "../../../../shared/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../../shared/constants/constants";
import { IEmailExistenceUsecase } from "../../../../domain/interfaces/usecase/common-usecase.interfaces";
import { IBcryptService } from "../../../../domain/interfaces/service/bcrypt-service.interface";
import { IVendor } from "../../../../domain/models/vendor";
import { IVendorRepository } from "../../../../domain/interfaces/repository/vendor-repository";

@injectable()
export class VendorRegisterStrategy implements IRegisterUserStrategy {
    constructor(
        @inject('IWalletRepository') private _walletRepository : IWalletRepository,
        @inject('IVendorRepository') private _vendorRepository : IVendorRepository,
        @inject('IEmailExistenceUsecase') private _emailExistence : IEmailExistenceUsecase,
        @inject('IBcryptService') private _bcryptService : IBcryptService
    ){}

    async register(input: RegisterUserInput): Promise<void> {
        if(input.role !== 'vendor') {
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE,HTTP_STATUS.BAD_REQUEST)
        }

        const userExists = await this._emailExistence.doesEmailExist(input.email,input.role);
        if(userExists.success) {
            throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS, HTTP_STATUS.BAD_REQUEST)
        }

        let hashedNewPassword = null;

        if(input.password){
            hashedNewPassword = await this._bcryptService.hash(input.password);
        }

        let data : Partial<IVendor> = {};
        if(input.googleId){
            data.name = input.name;
            data.email = input.email;
            data.googleId = input.googleId;
        }else{
            if(!input.password){
                throw new CustomError(ERROR_MESSAGES.PASSWORD_REQUIRED,HTTP_STATUS.BAD_REQUEST)
            }
            data.name = input.name;
            data.email = input.email;
            data.password = hashedNewPassword!
        }

        const newVendor = await this._vendorRepository.saveUser(data);
        await this._walletRepository.createWallet({userId : newVendor._id , userType : 'Vendor',role : 'vendor'});
    }
}