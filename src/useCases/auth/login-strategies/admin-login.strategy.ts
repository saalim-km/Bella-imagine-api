import { inject, injectable } from "tsyringe";
import { ILoginStrategy } from "../interfaces/login-strategy.interface";
import { IClientEntity } from "../../../entities/models/client.entity";
import { LoginUserDto } from "../../../shared/dtos/user.dto";
import { IAdminEntity } from "../../../entities/models/admin.entity";
import { IAdminRepository } from "../../../entities/repositoryInterfaces/admin/admin-repository.interface";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { privateDecrypt } from "crypto";
import { IBcrypt } from "../../../frameworks/security/bcrypt.interface";

@injectable()
export class AdminLoginStrategy implements ILoginStrategy {
  constructor(
    @inject("IAdminRepository") private adminRepository: IAdminRepository,
    @inject("IBcrypt") private passBcrypt: IBcrypt
  ) {}

  async login(data: LoginUserDto): Promise<IAdminEntity | null> {
    const admin = await this.adminRepository.findByEmail(data.email);

    if (!admin) {
      throw new CustomError(
        ERROR_MESSAGES.EMAIL_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (!data.password || !admin.password) {
      throw new Error("password is missing in vendor login strategy");
    }

    if (admin.role !== "admin") {
      throw new CustomError(
        `Access denied: ${admin.role} does not have permission to access the admin dashboard.`,
        HTTP_STATUS.FORBIDDEN
      );
    }
    
    const isPassMatch = await this.passBcrypt.compare(
      data.password,
      admin.password
    );

    if (!isPassMatch) {
      throw new CustomError("Wrong Password", HTTP_STATUS.UNAUTHORIZED);
    }

    return admin;
  }
}
