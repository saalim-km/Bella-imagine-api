import { Request, Response } from "express";
import { IGetWalletDetailsOfUserController } from "../../../entities/controllerInterfaces/wallet/get-wallet-details-of-user-cntroller.interface";
import { IGetWalletDetailsOfUserUseCase } from "../../../entities/usecaseInterfaces/wallet/get-wallet-details-of-user-usecase.interface";
import { HTTP_STATUS } from "../../../shared/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetWalletDetailsOfUserController
  implements IGetWalletDetailsOfUserController
{
  constructor(
    @inject("IGetWalletDetailsOfUserUseCase")
    private getWalletDetailsOfUserUseCase: IGetWalletDetailsOfUserUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user._id;

    const walletData = await this.getWalletDetailsOfUserUseCase.execute(userId);

    res.status(HTTP_STATUS.OK).json({ success: true, walletData });
  }
}
