import { inject, injectable } from "tsyringe";
import { IWalletUsecase } from "../../domain/interfaces/usecase/wallet-usecase.interface";
import { IWalletRepository } from "../../domain/interfaces/repository/wallet.repository";
import { Types } from "mongoose";
import { IWallet, PopulatedWallet } from "../../domain/models/wallet";
import { CustomError } from "../../shared/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { creditAmountToWalletInput } from "../../domain/interfaces/usecase/types/wallet.types";
import { IBookingRepository } from "../../domain/interfaces/repository/booking.repository";

@injectable()
export class WalletUsecase implements IWalletUsecase {
    constructor(
        @inject("IWalletRepository") private _walletRepository: IWalletRepository,
        @inject('') private _bookingRepository: IBookingRepository,
    ){}

    async fetchWallet(userId: Types.ObjectId): Promise<PopulatedWallet> {
        const wallet = await this._walletRepository.findByUserId(userId);
        if (!wallet) {
            throw new CustomError(ERROR_MESSAGES.WALLET_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
        return wallet;
    }

    async creditAmountToWallet(input: creditAmountToWalletInput): Promise<IWallet> {
        const {amount , purpose , userId , bookingId} = input;
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking) {
            throw new CustomError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
         
        const transaction = 
    }
}