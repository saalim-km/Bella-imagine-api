import { Types } from "mongoose";
import { PopulatedWallet } from "../../models/wallet";
import { creditAmountToWalletInput } from "./types/wallet.types";
import { WalletQueryInput } from "../../../shared/utils/zod-validations/presentation/client.schema";

export interface IWalletUsecase {
    fetchWallet(userId: Types.ObjectId): Promise<PopulatedWallet>
    creditAmountToWallet(input : creditAmountToWalletInput) : Promise<void>
    creditAdminCommissionToWallet(bookingId: Types.ObjectId): Promise<void>;
    fetchAdminWallet(queryOptions?: WalletQueryInput): Promise<PopulatedWallet>
    fetchWalletWithPagination(
        userId: Types.ObjectId,
        queryOptions: WalletQueryInput
      ): Promise<{
        wallet: PopulatedWallet;
        totalTransactions: number;
        currentPage: number;
        totalPages: number;
      }>
}