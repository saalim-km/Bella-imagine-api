import { injectable } from "tsyringe";
import { PopulatedWallet } from "../../../entities/models/wallet.entity";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/wallet-repository.interface";
import { WalletModel } from "../../../frameworks/database/models/wallet.model";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { PaymentModel } from "../../../frameworks/database/models/payment.model";

@injectable()
export class WalletRepository implements IWalletRepository {
  async create(userId: any, userType: string, role: string): Promise<void> {
    await WalletModel.create({ userId, userType, role });
  }

  async findPopulatedWalletByUserId(userId: any): Promise<PopulatedWallet> {
    return (await WalletModel.findOne({ userId })
      .populate({
        path: "userId",
        select: "firstName lastName email",
      })
      .populate("paymentId")) as unknown as PopulatedWallet;
  }

  async findWalletByUserIdAndUpdateBalanceAndAddPaymentId(
    userId: any,
    balance: number,
    paymentId: any,
    releasefund?: boolean
  ): Promise<void> {
    const wallet = await WalletModel.findOne({ userId });

    console.log(
      "inside findWalletByUserIdAndUpdateBalanceAndAddPaymentId",
      wallet
    );
    console.log(
      "inside findWalletByUserIdAndUpdateBalanceAndAddPaymentId balance",
      balance
    );

    if (!wallet) {
      throw new CustomError(ERROR_MESSAGES.WRONG_ID, HTTP_STATUS.BAD_REQUEST);
    }

    let newPaymentId = paymentId;
    console.log("here is the payment id==>", paymentId);
    if (balance < 0) {
      const payment = await PaymentModel.findById(paymentId);

      if (!releasefund) {
        const newPayment = await PaymentModel.create({
          userId,
          receiverId: payment?.receiverId,
          bookingId: payment?.bookingId,
          createrType: payment?.createrType,
          receiverType: payment?.receiverType,
          amount: payment?.amount,
          currency: payment?.currency,
          purpose: payment?.purpose,
          status: "refunded",
          paymentIntentId: payment?.paymentIntentId,
          transactionId: `TXN_${Date.now()}`,
          createdAt: new Date(),
        });

        newPaymentId = newPayment._id;
      }
    }

    const newBalance = wallet.balance + balance;
    if (newBalance < 0) {
      throw new CustomError("Insufficient funds", HTTP_STATUS.BAD_REQUEST);
    }
    console.log("befor setting new balance");
    wallet.balance = newBalance;
    wallet.paymentId.push(newPaymentId);
    await wallet.save();
  }

  async findWalletByUserIdAndUpdateBalanceForCancel(
    userId: any,
    balance: number,
    addToTransactions?: string
  ): Promise<void> {
    const wallet = await WalletModel.findOne({ userId });

    console.log(
      "inside findWalletByUserIdAndUpdateBalanceAndAddPaymentId",
      wallet
    );
    console.log(
      "inside findWalletByUserIdAndUpdateBalanceAndAddPaymentId balance",
      balance
    );

    if (!wallet) {
      throw new CustomError(ERROR_MESSAGES.WRONG_ID, HTTP_STATUS.BAD_REQUEST);
    }

    const newBalance = wallet.balance + balance;
    if (newBalance < 0) {
      throw new CustomError("Insufficient funds", HTTP_STATUS.BAD_REQUEST);
    }
    wallet.balance = newBalance;
    if (addToTransactions) {
      wallet.paymentId.push(addToTransactions as any);
    }
    await wallet.save();
  }
}
