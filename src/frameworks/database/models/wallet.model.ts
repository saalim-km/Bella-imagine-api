import { Document, model, ObjectId } from "mongoose";
import { IWalletEntity } from "../../../entities/models/wallet.entity";
import { walletSchema } from "../schemas/wallet.schema";

export interface IWalletModel
  extends Omit<IWalletEntity, "_id" | "userId" | "transactionId">,
    Document {
  _id: ObjectId;
  userId: ObjectId;
  paymentId: ObjectId[];
}

export const WalletModel = model<IWalletModel>("Wallet", walletSchema);
