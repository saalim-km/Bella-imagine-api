import { inject, injectable } from "tsyringe";
import { ILoginUserStrategy, IUserLoginUsecase } from "../../domain/interfaces/usecase/auth-usecase.interfaces";
import { IEmailExistenceUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { IBcryptService } from "../../domain/interfaces/service/bcrypt-service.interface";
import { LoginUserInput } from "./auth.types";
import { CustomError } from "../../shared/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";

@injectable()
export class LoginUserUsecase implements IUserLoginUsecase {
    private _strategies : Record<string , ILoginUserStrategy>
    constructor(
        @inject('IBcryptService') private _bcryptService : IBcryptService
    ){
        this._strategies = {
            // client : this._clientLoginStrategy,
            // vendor : this._vendorLoginStrategy
        }
    }

    async loginUser(input : LoginUserInput): Promise<void> {

    }
}