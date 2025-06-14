import { inject, injectable } from "tsyringe";
import { IPaymentUsecaase } from "../../domain/interfaces/usecase/payment.usecase";
import { Payment } from "../../interfaceAdapters/database/schemas/payment.schema";
import { BaseRepository } from "../../interfaceAdapters/repositories/base-repository.mongo";
import { IPayment } from "../../domain/models/payment";
import { CreatePaymentIntenServicetInput } from "../../domain/interfaces/usecase/types/payment.types";
import { CustomError } from "../../shared/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { IStripeService } from "../../domain/interfaces/service/stripe-service.interface";

@injectable()
export class PaymentUsecase extends BaseRepository<IPayment> implements IPaymentUsecaase {
    constructor(
    @inject("IStripeService") private _stripeService: IStripeService,
        
    ){
        super(Payment)
    }

    async processPayment(input: IPayment): Promise<IPayment> {
        const payment = await this.create(input);
        if(!payment) {
            throw new CustomError(ERROR_MESSAGES.PAYMENT_FAILED , HTTP_STATUS.BAD_REQUEST);
        }
        return payment;
    }

    async createPaymentIntent(input: CreatePaymentIntenServicetInput): Promise<string> {
        const paymentIntent = await this._stripeService.createPaymentIntent(input);
        if (!paymentIntent || !paymentIntent.client_secret) {
            throw new CustomError(ERROR_MESSAGES.PAYMENT_INTENT_CREATION_FAILED, HTTP_STATUS.BAD_REQUEST);
        }
        return paymentIntent.client_secret
    }
}