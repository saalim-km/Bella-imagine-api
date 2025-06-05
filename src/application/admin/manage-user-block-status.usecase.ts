import { inject, injectable } from "tsyringe";
import { IManageUserBlockStatusUseCase } from "../../domain/interfaces/usecase/admin-usecase.interface";
import { updateUserStatusInput } from "../../domain/interfaces/usecase/types/admin.types";
import { IClientRepository } from "../../domain/interfaces/repository/client-repository";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor-repository";
import { CustomError } from "../../shared/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";

@injectable()
export class ManageUserBlockStatusUsecase
  implements IManageUserBlockStatusUseCase
{
  constructor(
    @inject("IClientRepository") private _clientRepository: IClientRepository,
    @inject("IVendorRepository") private _vendorRepository: IVendorRepository
  ) {}
  async blockUser(input: updateUserStatusInput): Promise<void> {
    switch(input.role){
        case 'client':
            await this._clientRepository.update(input.id , {isblocked : input.isblocked})
            break;
        case 'vendor':
            console.log('in vendor switch case ',input);
            const vendor = await this._vendorRepository.update(input.id , {isblocked : input.isblocked})
            console.log(vendor);
            break;
        default : 
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE , HTTP_STATUS.BAD_REQUEST)
    }
  }
}
