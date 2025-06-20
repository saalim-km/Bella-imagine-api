import { IPayment, PaymentStatus } from "../../models/payment";
import { IBaseRepository } from "./base.repository";

export interface IPaymentRepository extends IBaseRepository<IPayment> {
    findByIntentIdAndUpdateStatus(intentInd : string , status : PaymentStatus) : Promise<IPayment | null>
}