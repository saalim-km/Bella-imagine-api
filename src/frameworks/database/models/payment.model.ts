import { model } from "mongoose";
import { IPaymentEntity } from "../../../entities/models/payment.entity";
import { paymentSchema } from "../schemas/payment.schema";

export interface IPaymentModel extends IPaymentEntity {}

export const PaymentModel = model<IPaymentModel>('Payment',paymentSchema)