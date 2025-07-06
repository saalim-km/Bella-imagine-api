import { inject, injectable } from "tsyringe";
import {
  IEmailExistenceUsecase,
} from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { ERROR_MESSAGES, TRole } from "../../shared/constants/constants";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { IClientRepository } from "../../domain/interfaces/repository/client.repository";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor.repository";
import { IUser } from "../../domain/models/user-base";
import { IEmailCheckResult } from "../../domain/interfaces/usecase/types/common.types";

@injectable()
export class EmailExistenceUsecase implements IEmailExistenceUsecase<IUser> {
  constructor(
    @inject("IClientRepository") private _clientRepository: IClientRepository,
    @inject("IVendorRepository") private _vendorRepository: IVendorRepository
  ) {}
  async doesEmailExist(
    email: string,
    userRole: TRole
  ): Promise<IEmailCheckResult<IUser>> {
    if (!email || !userRole) {
      throw new CustomError(ERROR_MESSAGES.INVALID_DATAS, 400);
    }

    switch (userRole) {
      case "client":
        {
        const client = await this._clientRepository.findByEmail(email);
        return {
          success: !!client,
          data: client,
        };
      }
      case "vendor":
        {
        const vendor = await this._vendorRepository.findByEmail(email);
        return {
          success: !!vendor,
          data: vendor,
        };
        }
      case 'admin' : 
      {
        const admin = await this._clientRepository.findAdmin(email);
        return {
          success: !!admin,
          data: admin,
        };
      }
      default:
        throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, 400);
    }
  }
}