import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IWalletRepository } from "../../domain/interfaces/repository/wallet-repository";
import { Wallet } from "../database/schemas/wallet.schema";
import { IWallet } from "../../domain/models/wallet";
import { TRole } from "../../shared/constants/constants";
import { ObjectId } from "mongoose";

@injectable()
export class WalletRepository extends BaseRepository<IWalletEntity> implements IWalletRepository {
    constructor(){
        super(Wallet)
    }

    async createWallet(userId: ObjectId, userType: string, role: TRole): Promise<void> {
        const data : Partial<IWallet> = {
            userId : userId,
            userType : userType,
            role : role
        }
    }
}