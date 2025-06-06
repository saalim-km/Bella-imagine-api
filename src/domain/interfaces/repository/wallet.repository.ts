import { CreateWalletInput } from "../../types/wallet.types";


export interface IWalletRepository {
    createWallet(input : CreateWalletInput): Promise<void>
}