import { inject, injectable } from "tsyringe";
import { IRegisterUsecase } from "../../entities/usecaseInterfaces/auth/register-usecase.interface";
import { IRegisterStrategy } from "./interfaces/register-strategy.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";
import { userDTO } from "../../shared/dtos/user.dto";


@injectable()
export class RegisterUsecase implements IRegisterUsecase {
  private strategies: Record<string, IRegisterStrategy>;
  constructor(
    @inject("ClientRegisterStrategy") private clientStrategy: IRegisterStrategy,
    @inject("VendorRegisterStrategy") private vendorStrategy: IRegisterStrategy
  ) {
    this.strategies = {
      client: this.clientStrategy,
      vendor: this.vendorStrategy,
    };
  }

  async execute(user: Partial<userDTO>): Promise<void> {
    console.log("enter register usecase");
    console.log(user);
    if (!user.role) {
      throw new CustomError("User role is missing", HTTP_STATUS.BAD_REQUEST);
    }

    const strategy = this.strategies[user.role];
    console.log(strategy);
    console.log(`from register usecase`);
    if (!strategy) {
      throw new CustomError("Invalid user role", HTTP_STATUS.FORBIDDEN);
    }

    console.log('after checking strategy validation');
    const validUser: userDTO = {
      name: user.name ?? "Default Name",
      email: user.email ?? "default@example.com",
      password: user.password ?? "defaultPassword",
      role: user.role,
    };

    await strategy.register(validUser);
  }
}
