import { IPaymentModel } from "../../../frameworks/database/models/payment.model";
import {
  IPaymentEntity,
  PaymentStatus,
  PopulatedPaymentsResponse,
} from "../../models/payment.entity";

export interface IPaymentRepository {
  save(payment: Partial<IPaymentEntity>): Promise<IPaymentEntity>;

  findByPaymentIntentIdAndUpdateStatus(
    paymentIntentId: string,
    status: PaymentStatus
  ): Promise<IPaymentEntity | null>;

  findByPaymentIntentId(
    paymentIntentId: string
  ): Promise<IPaymentEntity | null>;

  findByUserId(
    userId: any,
    skip: number,
    limit: number
  ): Promise<IPaymentEntity[]>;

  findByBookingId(bookingId: any): Promise<IPaymentEntity | null>;

  findTransactionByUserId(
    filter: any,
    skip: number,
    limit: number
  ): Promise<PopulatedPaymentsResponse>;

  findLastPaymentByUserId(userId: any): Promise<IPaymentEntity[] | null>

  findById(id : any): Promise<IPaymentModel | null>
}
