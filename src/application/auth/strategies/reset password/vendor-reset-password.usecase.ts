import { inject, injectable } from "tsyringe";
import { IResetPasswordStrategy } from "../../../../domain/interfaces/usecase/auth-usecase.interfaces";
import { IBcryptService } from "../../../../domain/interfaces/service/bcrypt-service.interface";
import { IEmailExistenceUsecase } from "../../../../domain/interfaces/usecase/common-usecase.interfaces";
import { IClient } from "../../../../domain/models/client";
import { ResetPasswordInput } from "../../../../domain/interfaces/usecase/types/auth.types";
import { CustomError } from "../../../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../../shared/constants/constants";
import { IVendorRepository } from "../../../../domain/interfaces/repository/vendor.repository";

@injectable()
export class VendorResetPasswordStrategy implements IResetPasswordStrategy {
    constructor(
        @inject('IBcryptService') private _bcryptService : IBcryptService,
        @inject('IEmailExistenceUsecase') private _emailExistence : IEmailExistenceUsecase<IClient>,
        @inject('IVendorRepository') private _vendorRepo : IVendorRepository
    ){}

    async resetPassword(input: ResetPasswordInput): Promise<void> {
        const {email , role , password} = input;
        const {data,success} = await this._emailExistence.doesEmailExist(email , role)

        if(!success || !data?._id){
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND , HTTP_STATUS.NOT_FOUND)
        }

        const newHashedPass = await this._bcryptService.hash(password);
        await this._vendorRepo.update(data._id,{password : newHashedPass})
    }
}