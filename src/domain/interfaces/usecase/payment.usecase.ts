import { IPayment } from "../../models/payment";
import { IBaseRepository } from "../repository/base.repository";
import { CreatePaymentIntenServicetInput } from "./types/payment.types";

export interface IPaymentUsecaase extends IBaseRepository<IPayment> {
    processPayment(input : IPayment) : Promise<IPayment>
    createPaymentIntent(input: CreatePaymentIntenServicetInput): Promise<string>;
}