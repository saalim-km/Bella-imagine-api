import { CreateWalletInput, UpdateWalletBalanceInput } from "../../types/wallet.types";


export interface IWalletRepository {
    createWallet(input : CreateWalletInput): Promise<void>
    findByIdAndUpdateWalletBalance(input : UpdateWalletBalanceInput) : Promise<void>
}