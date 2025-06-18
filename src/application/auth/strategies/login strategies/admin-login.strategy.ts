import { inject, injectable } from "tsyringe";
import { ILoginUserStrategy } from "../../../../domain/interfaces/usecase/auth-usecase.interfaces";
import { IEmailExistenceUsecase, IGetPresignedUrlUsecase } from "../../../../domain/interfaces/usecase/common-usecase.interfaces";
import { IBcryptService } from "../../../../domain/interfaces/service/bcrypt-service.interface";
import { LoginUserInput, LoginUserOuput } from "../../../../domain/interfaces/usecase/types/auth.types";
import { CustomError } from "../../../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../../shared/constants/constants";
import { IClient } from "../../../../domain/models/client";

@injectable()
export class AdminLoginStrategy implements ILoginUserStrategy {
    constructor(
        @inject('IEmailExistenceUsecase') private _emailExistenceUsecase : IEmailExistenceUsecase<IClient>,
        @inject('IBcryptService') private _bcryptService : IBcryptService,
        @inject('IGetPresignedUrlUsecase') private _getPresignedUrl : IGetPresignedUrlUsecase
    ){}
    async login(input : LoginUserInput): Promise<LoginUserOuput> {
        const {email , password , role} = input;
        const admin = await this._emailExistenceUsecase.doesEmailExist(email , role);
        if(!admin.success){
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE , HTTP_STATUS.NOT_FOUND)
        }

        if(!admin.data?.password){
            throw new CustomError(ERROR_MESSAGES.USER_LOGIN_WITHOUT_PASSWORD, HTTP_STATUS.BAD_REQUEST)
        }

        const isPassMatch = await this._bcryptService.compare(password , admin.data.password)
        if(!isPassMatch){
            throw new CustomError(ERROR_MESSAGES.INVALID_PASSWORD, HTTP_STATUS.UNAUTHORIZED)
        }

        if(admin.data.profileImage){
            admin.data.profileImage = await this._getPresignedUrl.getPresignedUrl(admin.data.profileImage);
        }

        return {
            _id : admin.data._id.toString(),
            name : admin.data.name,
            email : admin.data.email,
            role : admin.data.role,
            avatar : admin.data.profileImage
        }
    }

}