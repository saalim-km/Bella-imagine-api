import { inject, injectable } from "tsyringe";
import { IRegisterUserStrategy, IRegisterUserUsecase } from "../../domain/interfaces/usecase/auth-usecase.interfaces";
import { RegisterUserInput } from "../../domain/interfaces/usecase/types/auth.types";
import { CustomError } from "../../shared/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";

@injectable()
export class RegisterUserUsecase implements IRegisterUserUsecase {
    private _strategy : Record<string , IRegisterUserStrategy>;
    constructor(
        @inject('ClientRegisterStrategy') private  _clientRegisterStrategy : IRegisterUserStrategy,
        @inject('VendorRegisterStrategy') private _vendorRegisterStrategy : IRegisterUserStrategy
    ){
        this._strategy = {
            client : this._clientRegisterStrategy,
            vendor : this._vendorRegisterStrategy
        }
    }
    async register(input: RegisterUserInput): Promise<void> {

        if(input.role === 'admin'){
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, HTTP_STATUS.FORBIDDEN)
        }else if(!input.role){
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, HTTP_STATUS.FORBIDDEN)
        }

        const strategy = this._strategy[input.role]

        if(!strategy){
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE,HTTP_STATUS.FORBIDDEN)
        }

        await strategy.register(input)
    }
}