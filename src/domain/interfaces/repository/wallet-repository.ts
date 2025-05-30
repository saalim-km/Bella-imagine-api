import { ObjectId } from "mongoose";
import { TRole } from "../../../shared/constants/constants";
import { CreateWalletInput } from "../../types/wallet.types";


export interface IWalletRepository {
    createWallet(input : CreateWalletInput): Promise<void>
}