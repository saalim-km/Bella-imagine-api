import { Types } from "mongoose";
import { IWallet } from "../models/wallet";

export type CreateWalletInput = Pick<IWallet, 'userType' | 'role' | 'userId'>;

export interface UpdateWalletBalanceInput {
    userId : Types.ObjectId,
    paymentId : Types.ObjectId,
    balanceAmount : number
}

export interface WalletQueryOptions {
  search?: string
  status?: string
  purpose?: string
  dateRange?: string
  sortField?: string
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}