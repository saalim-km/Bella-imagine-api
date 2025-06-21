import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IWalletRepository } from "../../domain/interfaces/repository/wallet.repository";
import { Wallet } from "../database/schemas/wallet.schema";
import { IWallet, PopulatedWallet } from "../../domain/models/wallet";
import {
  CreateWalletInput,
  UpdateWalletBalanceInput,
} from "../../domain/types/wallet.types";
import { Types } from "mongoose";

@injectable()
export class WalletRepository
  extends BaseRepository<IWallet>
  implements IWalletRepository
{
  constructor() {
    super(Wallet);
  }

  async createWallet(input: CreateWalletInput): Promise<void> {
    const data: Partial<IWallet> = {
      userId: input.userId,
      userType: input.userType,
      role: input.role,
    };
    await this.create(data);
  }

  async findByIdAndUpdateWalletBalance(
    input: UpdateWalletBalanceInput
  ): Promise<void> {
    const { balanceAmount, paymentId, userId } = input;
    await this.model.findOneAndUpdate(
      { userId: userId },
      { $push: { paymentId: paymentId }, $inc: { balance: balanceAmount } }
    );
  }

  async findByUserId(userId: Types.ObjectId): Promise<PopulatedWallet> {
    return (await this.model
      .findOne({ userId })
      .populate({
        path: "userId",
        select: "name email",
      })
      .populate({
        path: "paymentId",
        select:
          "userId bookingId transactionId paymentIntentId purpose amount currency status createdAt",
        options: { sort: { createdAt: -1 } },
      })) as unknown as PopulatedWallet;
  }

  async addPaymnetIdToWallet(
    userId: Types.ObjectId,
    paymentId: Types.ObjectId
  ): Promise<void> {
    await this.model.findOneAndUpdate(
      { userId: userId },
      { $push: { paymentId: paymentId } }
    );
  }

  async updateWalletBalanceAndAddPaymentId(
    input: UpdateWalletBalanceInput
  ): Promise<void> {
    const { balanceAmount, paymentId, userId } = input;
    await this.model.findOneAndUpdate(
      { userId: userId },
      { $push: { paymentId: paymentId }, $inc: { balance: balanceAmount } }
    );
  }

  async fetchAdminWallet(): Promise<PopulatedWallet> {
    const wallet = await this.model
      .findOne({ userType: "Admin" })
      .populate({
        path: "paymentId",
        select:
          "userId bookingId transactionId paymentIntentId purpose amount currency status createdAt",
        options: { sort: { createdAt: -1 } },
      }) as unknown as PopulatedWallet

      return wallet
  }
}
