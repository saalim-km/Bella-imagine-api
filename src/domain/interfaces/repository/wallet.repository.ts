import { Types } from "mongoose";
import { IWallet, PopulatedWallet } from "../../models/wallet";
import { CreateWalletInput, UpdateWalletBalanceInput } from "../../types/wallet.types";
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
}