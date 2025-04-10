import { inject, injectable } from "tsyringe";
import { PopulatedPaymentsResponse } from "../../entities/models/payment.entity";
import { IPaymentRepository } from "../../entities/repositoryInterfaces/payment/payment-repository.interface";
import { IGetAllTransactionsByUserIdUseCase } from "../../entities/usecaseInterfaces/payment/get-all-transactions-by-userId-controlle.interface";

@injectable()
export class GetAllTransactionsByUserIdUseCase
  implements IGetAllTransactionsByUserIdUseCase
{
  constructor(
    @inject("IPaymentRepository") private paymentRepository: IPaymentRepository
  ) {}
  async execute(
    userId: any,
    purpose: string,
    pageNumber: number,
    pageSize: number
  ): Promise<PopulatedPaymentsResponse> {
    let filter: any = {};
    if (userId) {
      filter.$or = [{ userId: userId }, { receiverId: userId }];
    }

    if (purpose) {
      filter.purpose = purpose;
    }

    const validPageNumber = Math.max(1, pageNumber || 1);
    const validPageSize = Math.max(1, pageSize || 10);
    const skip = (validPageNumber - 1) * validPageSize;
    const limit = validPageSize;

    console.log(filter);

    const { payments, total } =
      await this.paymentRepository.findTransactionByUserId(filter, skip, limit);

    console.log("this is the payment queried from the db=>", payments);

    const response: PopulatedPaymentsResponse = {
      payments,
      total: Math.ceil(total / validPageSize),
    };

    return response;
  }
}
