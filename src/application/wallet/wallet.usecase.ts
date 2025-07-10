import { inject, injectable } from "tsyringe";
import { IWalletUsecase } from "../../domain/interfaces/usecase/wallet-usecase.interface";
import { IWalletRepository } from "../../domain/interfaces/repository/wallet.repository";
import { Types } from "mongoose";
import { PopulatedWallet } from "../../domain/models/wallet";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { creditAmountToWalletInput } from "../../domain/interfaces/usecase/types/wallet.types";
import { IBookingRepository } from "../../domain/interfaces/repository/booking.repository";
import { IPaymentRepository } from "../../domain/interfaces/repository/payment.repository";
import { IClientRepository } from "../../domain/interfaces/repository/client.repository";
import { WalletQueryInput } from "../../shared/utils/zod-validations/presentation/client.schema";

@injectable()
export class WalletUsecase implements IWalletUsecase {
  constructor(
    @inject("IWalletRepository") private _walletRepository: IWalletRepository,
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("IPaymentRepository")
    private _paymentRepository: IPaymentRepository, // Assuming a payment repository is needed
    @inject("IClientRepository") private _clientRepository: IClientRepository // Assuming a client repository is needed
  ) {}

  async fetchWallet(userId: Types.ObjectId): Promise<PopulatedWallet> {
    const wallet = await this._walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new CustomError(
        ERROR_MESSAGES.WALLET_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    return wallet;
  }

  async creditAmountToWallet(input: creditAmountToWalletInput): Promise<void> {
    const { amount, purpose, userId, bookingId } = input;
    const booking = await this._bookingRepository.findById(bookingId);
    if (!booking) {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const wallet = await this._walletRepository.findOne({ userId: userId });
    if (!wallet) {
      throw new CustomError(
        ERROR_MESSAGES.WALLET_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    if (amount <= 0) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_AMOUNT,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const transaction = await this._paymentRepository.create({
      amount: amount,
      purpose: purpose,
      userId: userId,
      bookingId: bookingId,
      createrType: "Client",
      receiverType: "Vendor",
      transactionId: `txn_${new Date().getTime()}`,
      currency: "INR",
      status: "succeeded",
    });
    if (!transaction || !transaction._id) {
      throw new CustomError(
        ERROR_MESSAGES.FAILED_TO_CREATE_PAYMENT,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    await this._walletRepository.updateWalletBalanceAndAddPaymentId({
      userId: userId,
      balanceAmount: amount,
      paymentId: transaction._id,
    });
  }

  async creditAdminCommissionToWallet(
    bookingId: Types.ObjectId
  ): Promise<void> {
    const booking = await this._bookingRepository.findById(bookingId);
    if (!booking) {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const adminCommission = (booking.totalPrice / 100) * 2; //  2% commission

    const admin = await this._clientRepository.findOne({ role: "admin" });
    if (!admin || !admin._id) {
      throw new CustomError(
        ERROR_MESSAGES.ADMIN_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const transaction = await this._paymentRepository.create({
      amount: adminCommission,
      purpose: "commission-credit",
      userId: admin._id,
      bookingId: bookingId,
      createrType: "Client",
      receiverType: "Admin",
      transactionId: `txn_${new Date().getTime()}`,
      currency: "INR",
      status: "succeeded",
    });

    if (!transaction || !transaction._id) {
      throw new CustomError(
        ERROR_MESSAGES.FAILED_TO_CREATE_PAYMENT,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    await this._walletRepository.updateWalletBalanceAndAddPaymentId({
      userId: admin?._id,
      balanceAmount: adminCommission,
      paymentId: transaction._id,
    });
  }

  async fetchAdminWallet(queryOptions?: WalletQueryInput): Promise<PopulatedWallet> {
    const wallet = await this._walletRepository.fetchAdminWallet(queryOptions)
    if (!wallet) {
      throw new CustomError(ERROR_MESSAGES.WALLET_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    return wallet
  }

  async fetchWalletWithPagination(
    userId: Types.ObjectId,
    queryOptions: WalletQueryInput
  ): Promise<{
    wallet: PopulatedWallet;
    totalTransactions: number;
    currentPage: number;
    totalPages: number;
  }> {
    console.log('fetchwalletwithpagination usecase');
    const wallet = await this._walletRepository.findByUserId(
      userId,
      queryOptions
    );
    console.log('got wallet of ',wallet);
    const totalTransactions = await this._walletRepository.getTransactionCount(
      userId,
      queryOptions
    );

    if (!wallet) {
      throw new CustomError(
        ERROR_MESSAGES.WALLET_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const totalPages = queryOptions.limit
      ? Math.ceil(totalTransactions / queryOptions.limit)
      : 1;

    return {
      wallet,
      totalTransactions,
      currentPage: queryOptions.page || 1,
      totalPages,
    };
  }
}
