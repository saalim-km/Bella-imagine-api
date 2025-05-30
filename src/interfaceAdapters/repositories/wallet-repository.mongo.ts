import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IWalletRepository } from "../../domain/interfaces/repository/wallet-repository";
import { Wallet } from "../database/schemas/wallet.schema";
import { IWallet } from "../../domain/models/wallet";
import { CreateWalletInput } from "../../domain/types/wallet.types";

@injectable()
export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {
    constructor(){
        super(Wallet)
    }

    async createWallet(input : CreateWalletInput): Promise<void> {
        const data : Partial<IWallet> = {
            userId : input.userId,
            userType : input.userType,
            role : input.role
        }
        await this.create(data)
    }
}