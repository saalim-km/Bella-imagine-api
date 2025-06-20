import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IPayment, PaymentStatus } from "../../domain/models/payment";
import { IPaymentRepository } from "../../domain/interfaces/repository/payment.repository";
import { Payment } from "../database/schemas/payment.schema";

@injectable()
export class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository {
    constructor(){
        super(Payment)
    }


    async findByIntentIdAndUpdateStatus(intentInd: string, status: PaymentStatus): Promise<IPayment | null> {
        return await Payment.findOneAndUpdate({paymentIntentId : intentInd} , {status : status})
    }
}