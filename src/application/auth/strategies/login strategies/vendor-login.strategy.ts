import { inject, injectable } from "tsyringe";
import { ILoginUserStrategy } from "../../../../domain/interfaces/usecase/auth-usecase.interfaces";
import { IEmailExistenceUsecase, IGetPresignedUrlUsecase } from "../../../../domain/interfaces/usecase/common-usecase.interfaces";
import { IBcryptService } from "../../../../domain/interfaces/service/bcrypt-service.interface";
import { LoginUserInput, LoginUserOuput } from "../../../../domain/interfaces/usecase/types/auth.types";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../../shared/constants/constants";
import { IClient } from "../../../../domain/models/client";
import { CustomError } from "../../../../shared/utils/helper/custom-error";
import { Mapper } from "../../../../shared/utils/mapper";

@injectable()
export class VendorLoginStrategy implements ILoginUserStrategy {
    constructor(
        @inject('IEmailExistenceUsecase') private _emailExistenceUsecase : IEmailExistenceUsecase<IClient>,
        @inject('IBcryptService') private _bcryptService : IBcryptService,
        @inject('IGetPresignedUrlUsecase') private _getPresignedUrl : IGetPresignedUrlUsecase
    ){}
    async login(input : LoginUserInput): Promise<LoginUserOuput> {
        const {email , password , role} = input;
        const vendor = await this._emailExistenceUsecase.doesEmailExist(email , role);
        if(!vendor.success){
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND , HTTP_STATUS.NOT_FOUND)
        }

        if(vendor.data?.isblocked) {
            throw new CustomError(ERROR_MESSAGES.USER_BLOCKED, HTTP_STATUS.FORBIDDEN)
        }

        if(!vendor.data?.password && vendor.data?.password !== ''){
            throw new CustomError(ERROR_MESSAGES.USER_LOGIN_WITHOUT_PASSWORD, HTTP_STATUS.BAD_REQUEST)
        }

        const isPassMatch = await this._bcryptService.compare(password , vendor.data.password)
        if(!isPassMatch){
            throw new CustomError(ERROR_MESSAGES.INVALID_PASSWORD, HTTP_STATUS.UNAUTHORIZED)
        }

        if(vendor.data.profileImage){
            vendor.data.profileImage = await this._getPresignedUrl.getPresignedUrl(vendor.data.profileImage);
        }

        return Mapper.userMapper(vendor.data)
    }

}