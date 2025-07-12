import { Types } from "mongoose";
import { IWallet, PopulatedWallet } from "../../models/wallet";
import { CreateWalletInput, UpdateWalletBalanceInput, WalletQueryOptions } from "../../types/wallet.types";
import { IBaseRepository } from "./base.repository";


export interface IWalletRepository extends IBaseRepository<IWallet> {
    createWallet(input : CreateWalletInput): Promise<void>
    findByIdAndUpdateWalletBalance(input : UpdateWalletBalanceInput) : Promise<void>
    findByUserId(userId: Types.ObjectId): Promise<PopulatedWallet>
    addPaymnetIdToWallet(
        userId: Types.ObjectId,
        paymentId: Types.ObjectId,
    ): Promise<void>;
    updateWalletBalanceAndAddPaymentId(
        input: UpdateWalletBalanceInput
    ): Promise<void>;
    fetchAdminWallet(options?: WalletQueryOptions): Promise<PopulatedWallet>
    getTransactionCount(userId: Types.ObjectId, options?: WalletQueryOptions): Promise<number> 
    findByUserId(userId: Types.ObjectId, options?: WalletQueryOptions): Promise<PopulatedWallet>
}