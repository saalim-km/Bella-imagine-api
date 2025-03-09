import { inject, injectable } from "tsyringe";
import { ILogUseCaseIninterface } from "../../entities/usecaseIntefaces/auth/login-usecase.interface";
import { LoginUserDto } from "../../shared/dtos/user.dto";
import { ILoginStrategy } from "./interfaces/login-strategy.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";
import { IClientEntity } from "../../entities/models/client.entity";

@injectable()
export class LoginUseCase implements ILogUseCaseIninterface {
    private strategies;
    constructor(
        @inject("ClientLoginStrategy") private clientLoginStrategy : ILoginStrategy,
        @inject("VendorLoginStrategy") private vendorLoginStrategy : ILoginStrategy,
    ){
        this.strategies = {
            client : this.clientLoginStrategy,
            vendor : this.vendorLoginStrategy
        }
    }
    async execute(user: LoginUserDto): Promise<IClientEntity | null> {

            if (!user.role) {
              throw new CustomError("User role is missing", HTTP_STATUS.BAD_REQUEST);
            }
            console.log('from login usecase ',user);
        const strategy = this.strategies[user.role];
            console.log(strategy);
        return await strategy.login(user)
    }
}