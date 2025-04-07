import { injectable } from "tsyringe";
import {
  BookingListFromRepo,
  IBookingEntity,
} from "../../../entities/models/booking.entity";
import { IBookingRepository } from "../../../entities/repositoryInterfaces/booking/booking-repository.interface";
import {
  bookingModel,
} from "../../../frameworks/database/models/booking.model";

@injectable()
export class BookingRepository implements IBookingRepository {
  async findByUserId(
    filter: any,
    sort: any,
    skip: number,
    limit: number
  ): Promise<BookingListFromRepo> {
    const [bookings, total] = await Promise.all([
      bookingModel.find(filter)
        .populate({ path: "vendorId", select: "firstName lastName" })
        .populate({ path: "userId", select: "firstName lastName" })
        .sort(sort)
        .skip(skip)
        .limit(limit),
      bookingModel.countDocuments(filter),
    ]);

    return {
      bookings,
      total,
    };
  }

  async findById(id: any): Promise<IBookingEntity | null> {
    return await bookingModel.findById(id);
  }

  async save(data: Partial<IBookingEntity>): Promise<IBookingEntity> {
    return await bookingModel.create(data);
  }

  async findByIdAndUpdatePaymentId(id: any, paymentId: any): Promise<void> {
    await bookingModel.findByIdAndUpdate(id, { $set: { paymentId } });
  }

  async findByIdAndUpdatePaymentStatus(id: any, status: string): Promise<void> {
    await bookingModel.findByIdAndUpdate(id, {
      $set: { paymentStatus: status },
    });
  }

  async findByIdAndUpdateBookingStatus(id: any, status: string): Promise<void> {
    await bookingModel.findByIdAndUpdate(id, { $set: { status } });
  }

  async findByClientIdAndVendorId(
    clientId: any,
    vendorId: any
  ): Promise<IBookingEntity | null> {
    return await bookingModel.findOne({ userId: clientId, vendorId }).exec();
  }

  async updateClientApproved(id: any): Promise<IBookingEntity | null> {
    return await bookingModel.findOneAndUpdate(
      { userId: id },
      { $set: { isClientApproved: true } },
      { new: true }
    );
  }

  async updateVendorApproved(id: any): Promise<IBookingEntity | null> {
    return await bookingModel.findOneAndUpdate(
      { vendorId: id },
      { $set: { isVendorApproved: true } },
      { new: true }
    );
  }

  async isBothApproved(bookingId: any): Promise<IBookingEntity | null> {
    return await bookingModel.findOne({
      _id: bookingId,
      isClientApproved: true,
      isVendorApproved: true,
    });
  }

  async find(
    filter: any,
    sort: any,
    skip: number,
    limit: number
  ): Promise<BookingListFromRepo> {
    console.log('inside booking repositoy find', filter, sort, skip, limit)
    const [bookings, total] = await Promise.all([
      bookingModel.find(filter)
        .populate({ path: "vendorId", select: "firstName lastName" })
        .populate({ path: "userId", select: "firstName lastName" })
        .sort(sort)
        .skip(skip)
        .limit(limit),
      bookingModel.countDocuments(filter),
    ]);

    return {
      bookings,
      total,
    };
  }

  // latest for chat
  async findByClientId(clientId: any): Promise<IBookingEntity[]> {
    return await bookingModel.find({ userId: clientId })
      .populate(
        "vendorId",
        "firstName lastName email profileImage onlineStatus"
      )
      .exec();
  }

  async findByVendorId(vendorId: any): Promise<IBookingEntity[]> {
    return await bookingModel.find({ vendorId })
      .populate("userId", "firstName lastName email profileImage onlineStatus")
      .exec();
  }
}
