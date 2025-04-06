import { inject, injectable } from "tsyringe";
import { ILogUseCaseIninterface } from "../../entities/usecaseInterfaces/auth/login-usecase.interface";
import { LoginUserDto } from "../../shared/dtos/user.dto";
import { ILoginStrategy } from "./interfaces/login-strategy.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";
import { IClientEntity } from "../../entities/models/client.entity";
import { AdminLoginStrategy } from "./login-strategies/admin-login.strategy";

@injectable()
export class LoginUseCase implements ILogUseCaseIninterface {
  private strategies;
  constructor(
    @inject("ClientLoginStrategy") private clientLoginStrategy: ILoginStrategy,
    @inject("VendorLoginStrategy") private vendorLoginStrategy: ILoginStrategy,
    @inject("AdminLoginStrategy") private adminLoginStrategy: ILoginStrategy
  ) {
    this.strategies = {
      client: this.clientLoginStrategy,
      vendor: this.vendorLoginStrategy,
      admin: this.adminLoginStrategy,
    };
  }
  async execute(user: LoginUserDto): Promise<IClientEntity | null> {
    if (!user.role) {
      throw new CustomError("User role is missing", HTTP_STATUS.BAD_REQUEST);
    }

    const strategy = this.strategies[user.role];
    
    return await strategy.login(user);
  }
}
