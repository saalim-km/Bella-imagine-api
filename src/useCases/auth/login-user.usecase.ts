import { inject } from "tsyringe";
import { ILogUseCaseIninterface } from "../../entities/usecaseIntefaces/auth/login-usecase.interface";
import { LoginUserDto } from "../../shared/dtos/user.dto";
import { ILoginStrategy } from "./interfaces/login-strategy.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";
import { IClientEntity } from "../../entities/models/client.entity";

export class LoginUseCase implements ILogUseCaseIninterface {
    private strategies;
    constructor(
        @inject("ILoginStrategy") private clientLoginStrategy : ILoginStrategy,
        @inject("ILoginStrategy") private vendorLoginStrategy : ILoginStrategy,
    ){
        this.strategies = {
            client : this.clientLoginStrategy,
            vendor : this.vendorLoginStrategy
        }
    }
    async execute(user: LoginUserDto): Promise<IClientEntity> {

            if (!user.role) {
              throw new CustomError("User role is missing", HTTP_STATUS.BAD_REQUEST);
            }
        const strategy = this.strategies[user.role];

        return await strategy.login(user)
    }
}