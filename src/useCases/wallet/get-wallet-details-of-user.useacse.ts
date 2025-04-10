import { inject, injectable } from "tsyringe";
import { PopulatedWallet } from "../../entities/models/wallet.entity";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet-repository.interface";
import { IGetWalletDetailsOfUserUseCase } from "../../entities/usecaseInterfaces/wallet/get-wallet-details-of-user-usecase.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class GetWalletDetailsOfUserUseCase
  implements IGetWalletDetailsOfUserUseCase
{
  constructor(
    @inject("IWalletRepository") private walletRepository: IWalletRepository
  ) {}
  async execute(userId: any): Promise<PopulatedWallet> {
    if (!userId) {
      throw new CustomError(
        ERROR_MESSAGES.ID_NOT_PROVIDED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    return await this.walletRepository.findPopulatedWalletByUserId(userId);
  }
}