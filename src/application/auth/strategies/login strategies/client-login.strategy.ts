import { inject, injectable } from "tsyringe";
import { ILoginUserStrategy } from "../../../../domain/interfaces/usecase/auth-usecase.interfaces";
import { IEmailExistenceUsecase } from "../../../../domain/interfaces/usecase/common-usecase.interfaces";
import { IBcryptService } from "../../../../domain/interfaces/service/bcrypt-service.interface";
import { LoginUserInput } from "../../auth.types";
import { CustomError } from "../../../../shared/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../../shared/constants/constants";
import { IClient } from "../../../../domain/models/client";

@injectable()
export class ClientLoginStrategy implements ILoginUserStrategy {
    constructor(
        @inject('IEmailExistenceUsecase') private _emailExistenceUsecase : IEmailExistenceUsecase<>,
        @inject('IBcryptService') private _bcryptService : IBcryptService,
    ){}
    async login(input : LoginUserInput): Promise<void> {
        const {email , password , role} = input;
        const client = await this._emailExistenceUsecase.doesEmailExist(email , role);
        if(!client.success){
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND , HTTP_STATUS.NOT_FOUND)
        }

        if()
    }

}