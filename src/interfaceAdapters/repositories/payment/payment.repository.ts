import { injectable } from "tsyringe";
import {
  IPaymentEntity,
  PaymentStatus,
  PopulatedPayments,
  PopulatedPaymentsResponse,
} from "../../../entities/models/payment.entity";
import { IPaymentRepository } from "../../../entities/repositoryInterfaces/payment/payment-repository.interface";
import { IPaymentModel, PaymentModel } from "../../../frameworks/database/models/payment.model";

@injectable()
export class PaymentRepository implements IPaymentRepository {
  async save(payment: Partial<IPaymentEntity>): Promise<IPaymentEntity> {
    return await PaymentModel.create(payment);
  }

  async findByPaymentIntentIdAndUpdateStatus(
    paymentIntentId: string,
    status: PaymentStatus
  ): Promise<IPaymentEntity | null> {
    return await PaymentModel.findOneAndUpdate(
      { paymentIntentId },
      { $set: { status } },
      { new: true }
    );
  }

  async findByPaymentIntentId(
    paymentIntentId: string
  ): Promise<IPaymentEntity | null> {
    return await PaymentModel.findOne({ paymentIntentId });
  }

  async findByUserId(
    userId: any,
    skip: number,
    limit: number
  ): Promise<IPaymentEntity[] | []> {
    return await PaymentModel.find({ userId }).skip(skip).limit(limit);
  }

  async findByBookingId(bookingId: any): Promise<IPaymentEntity | null> {
    return await PaymentModel.findOne({ bookingId });
  }

  async findTransactionByUserId(
    filter: any,
    skip: number,
    limit: number
  ): Promise<PopulatedPaymentsResponse> {
    const [payments, total] = await Promise.all([
      PaymentModel.find(filter)
        .populate({
          path: "userId",
          select: "firstName lastName email",
        })
        .populate({
          path: "receiverId",
          select: "firstName lastName email",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      PaymentModel.countDocuments(filter),
    ]);

    return {
      payments: payments as unknown as PopulatedPayments[],
      total,
    };
  }

  async findLastPaymentByUserId(userId: any): Promise<IPaymentEntity[] | null> {
      return await PaymentModel.find({userId}).sort({createdAt: -1}).limit(1).lean()
  }

  async findById(id : any): Promise<IPaymentModel | null> {
    return await PaymentModel.findById(id)
  }
}