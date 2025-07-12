import { inject, injectable } from "tsyringe";
import { ILoginUserStrategy, IUserLoginUsecase } from "../../domain/interfaces/usecase/auth-usecase.interfaces";
import { LoginUserInput, LoginUserOuput } from "../../domain/interfaces/usecase/types/auth.types";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";

@injectable()
export class LoginUserUsecase implements IUserLoginUsecase {
    private _strategies : Record<string , ILoginUserStrategy>
    constructor(
        @inject('ClientLoginStrategy') private _clientLoginStrategy : ILoginUserStrategy,
        @inject('VendorLoginStrategy') private _vendortLoginStrategy : ILoginUserStrategy,
        @inject('AdminLoginStrategy') private _adminLoginStrategy : ILoginUserStrategy,
    ){
        this._strategies = {
            client : this._clientLoginStrategy,
            vendor : this._vendortLoginStrategy,
            admin : this._adminLoginStrategy
        }
    }

    async loginUser(input : LoginUserInput): Promise<LoginUserOuput> {
        const strategy = this._strategies[input.role];
        
        if(!strategy){
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE , HTTP_STATUS.BAD_REQUEST)
        }

        return await strategy.login(input)
    }
}