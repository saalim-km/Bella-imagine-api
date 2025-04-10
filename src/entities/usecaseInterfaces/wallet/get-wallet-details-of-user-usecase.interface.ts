import { PopulatedWallet } from "../../models/wallet.entity";

export interface IGetWalletDetailsOfUserUseCase {
  execute(userId: any): Promise<PopulatedWallet>;
}
