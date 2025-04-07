import { PopulatedWallet } from "../models/wallet.entity";

export interface IWalletRepository {
  create(userId: any, userType: string, role: string): Promise<void>;

  findPopulatedWalletByUserId(userId: any): Promise<PopulatedWallet>;

  findWalletByUserIdAndUpdateBalanceAndAddPaymentId(
    userId: any,
    balance: number,
    paymentId: any,
    releasefund?: boolean
  ): Promise<void>;

  findWalletByUserIdAndUpdateBalanceForCancel(
    userId: any,
    balance: number,
    addToTransactions?: string
  ): Promise<void>
}
