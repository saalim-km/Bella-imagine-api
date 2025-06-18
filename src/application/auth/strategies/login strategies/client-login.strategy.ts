import { inject, injectable } from "tsyringe";
import { ILoginUserStrategy } from "../../../../domain/interfaces/usecase/auth-usecase.interfaces";
import { IEmailExistenceUsecase, IGetPresignedUrlUsecase } from "../../../../domain/interfaces/usecase/common-usecase.interfaces";
import { IBcryptService } from "../../../../domain/interfaces/service/bcrypt-service.interface";
import { LoginUserInput, LoginUserOuput } from "../../../../domain/interfaces/usecase/types/auth.types";
import { CustomError } from "../../../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../../shared/constants/constants";
import { IClient } from "../../../../domain/models/client";

@injectable()
export class ClientLoginStrategy implements ILoginUserStrategy {
    constructor(
        @inject('IEmailExistenceUsecase') private _emailExistenceUsecase : IEmailExistenceUsecase<IClient>,
        @inject('IBcryptService') private _bcryptService : IBcryptService,
        @inject('IGetPresignedUrlUsecase') private _getPresignedUrl : IGetPresignedUrlUsecase
    ){}
    async login(input : LoginUserInput): Promise<LoginUserOuput> {
        const {email , password , role} = input;
        const client = await this._emailExistenceUsecase.doesEmailExist(email , role);
        if(!client.success){
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND , HTTP_STATUS.NOT_FOUND)
        }

        if(client.data?.isblocked) {
            throw new CustomError(ERROR_MESSAGES.USER_BLOCKED, HTTP_STATUS.FORBIDDEN)
        }

        if(!client.data?.password){
            throw new CustomError(ERROR_MESSAGES.USER_LOGIN_WITHOUT_PASSWORD, HTTP_STATUS.BAD_REQUEST)
        }

        const isPassMatch = await this._bcryptService.compare(password , client.data.password)
        if(!isPassMatch){
            throw new CustomError(ERROR_MESSAGES.INVALID_PASSWORD, HTTP_STATUS.UNAUTHORIZED)
        }

        if(client.data.profileImage){
            client.data.profileImage = await this._getPresignedUrl.getPresignedUrl(client.data.profileImage);
        }

        return {
            _id : client.data._id.toString(),
            name : client.data.name,
            email : client.data.email,
            role : client.data.role,
            avatar : client.data.profileImage
        }
    }

}