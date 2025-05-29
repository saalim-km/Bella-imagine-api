import { ObjectId } from "mongoose";
import { TRole } from "../../../shared/constants/constants";


export interface IWalletRepository {
    createWallet(input : ): Promise<void>
}