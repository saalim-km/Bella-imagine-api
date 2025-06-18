import { inject, injectable } from "tsyringe";
import { IGetUserDetailsStrategy, IGetUserDetailsUsecase } from "../../domain/interfaces/usecase/admin-usecase.interface";
import { UserDetailsInput } from "../../domain/interfaces/usecase/types/admin.types";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { IUser } from "../../domain/models/user-base";

@injectable()
export class GetuserDetailsUsecase implements IGetUserDetailsUsecase {
    private _strategies : Record<string , IGetUserDetailsStrategy>;
    constructor(
        @inject('GetClientDetailsStrategy') private _clientStrategy : IGetUserDetailsStrategy,
        @inject('GetVendorDetailsStrategy') private _vendorStrategy : IGetUserDetailsStrategy
    ){
        this._strategies = {
            client : this._clientStrategy,
            vendor : this._vendorStrategy
        }
    }

    async getUserDetail(input: UserDetailsInput): Promise<IUser> {
        const strategy = this._strategies[input.role];

        if(!strategy){
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE , HTTP_STATUS.UNAUTHORIZED)
        }

        return await strategy.getDetails(input)
    }
}