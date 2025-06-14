import { Types } from "mongoose";
import { IWallet, PopulatedWallet } from "../../models/wallet";
import { creditAmountToWalletInput } from "./types/wallet.types";

export interface IWalletUsecase {
    fetchWallet(userId: Types.ObjectId): Promise<PopulatedWallet>
    creditAmountToWallet(input : creditAmountToWalletInput) : Promise<IWallet>
}