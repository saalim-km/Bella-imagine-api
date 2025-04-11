import { PopulatedPaymentsResponse } from "../../models/payment.entity";

export interface IGetAllTransactionsByUserIdUseCase {
  execute(
    userId: any,
    purpose: string,
    pageNumber: number,
    pageSize: number
  ): Promise<PopulatedPaymentsResponse>;
}
