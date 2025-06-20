import { inject, injectable } from "tsyringe";
import { IResetPasswordStrategy, IResetPasswordUsecase } from "../../domain/interfaces/usecase/auth-usecase.interfaces";
import { ResetPasswordInput } from "../../domain/interfaces/usecase/types/auth.types";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";

@injectable()
export class ResetPasswordUsecase implements IResetPasswordUsecase {
    private _strategies : Record<string,IResetPasswordStrategy>
    constructor(
        @inject('VendorResetPasswordStrategy') private _vendorResetPassStrategy : IResetPasswordStrategy,
        @inject('ClientResetPasswordStrategy') private _clientResetPassStrategy : IResetPasswordStrategy
    ){
        this._strategies = {
            client : this._clientResetPassStrategy,
            vendor : this._vendorResetPassStrategy
        }
    }

    async resetPassword(input: ResetPasswordInput): Promise<void> {
        const {role} = input;
        const strategy = this._strategies[role]
        if(!strategy){
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE , HTTP_STATUS.BAD_REQUEST)
        }

        await strategy.resetPassword(input)
    }
}