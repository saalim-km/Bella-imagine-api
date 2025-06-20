import { inject, injectable } from "tsyringe";
import {
  IUserManagementUsecase,
} from "../../domain/interfaces/usecase/admin-usecase.interface";
import {
  UpdateUserStatusInput,
  UpdateVendorRequestInput,
} from "../../domain/interfaces/usecase/types/admin.types";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor.repository";
import { IClientRepository } from "../../domain/interfaces/repository/client.repository";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";

@injectable()
export class UserManagementUsecase implements IUserManagementUsecase {
  constructor(
    @inject("IVendorRepository") private _vendorRepository: IVendorRepository,
    @inject("IClientRepository") private _clientRepository: IClientRepository
  ) {}

  async updateBlockStatus(input: UpdateUserStatusInput): Promise<void> {
    switch (input.role) {
      case "client":
        await this._clientRepository.update(input.id, {
          isblocked: input.isblocked,
        });
        break;
      case "vendor":
        const vendor = await this._vendorRepository.update(input.id, {
          isblocked: input.isblocked,
        });
        break;
      default:
        throw new CustomError(
          ERROR_MESSAGES.INVALID_ROLE,
          HTTP_STATUS.BAD_REQUEST
        );
    }
  }

  async updateVendorRequest(input: UpdateVendorRequestInput): Promise<void> {
    const status = input.status ? "accept" : "reject";
    const vendor = await this._vendorRepository.update(input.id, { isVerified: status });

    if(status === 'reject'){
      await this._vendorRepository.update(vendor?._id!,{verificationDocument : ''});
    }
  }
}
