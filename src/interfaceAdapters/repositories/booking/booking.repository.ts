import { injectable } from "tsyringe";
import {
  BookingListFromRepo,
  IBookingEntity,
} from "../../../entities/models/booking.entity";
import { IBookingRepository } from "../../../entities/repositoryInterfaces/booking/booking-repository.interface";
import {
  bookingModel,
} from "../../../frameworks/database/models/booking.model";
import { IClientEntity } from "../../../entities/models/client.entity";
import { IVendorEntity } from "../../../entities/models/vendor.entity";
import { TRole } from "../../../shared/constants";
import { Types } from "mongoose";

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
        .populate({ path: "vendorId", select: "name" })
        .populate({ path: "userId", select: "name" })
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

  async findByPaymentIdAndUpdateBookingStatus(paymentId: any, status: string): Promise<void> {
    console.log('in findByIdAndUpdatePaymentStatus repository :',paymentId,status);
    await bookingModel.findOneAndUpdate({paymentId : paymentId},{$set : {paymentStatus : status}})
  }

  async findByIdAndUpdatePaymentStatus(id: any, status: string): Promise<void> {
    await bookingModel.findByIdAndUpdate(id, {
      $set: { paymentStatus: status },
    });
  }

  async findByIdAndUpdateBookingStatus(id: any, status: string): Promise<void> {
    console.log('in update booking status repository : ',id , status);
    await bookingModel.findByIdAndUpdate(id, { $set: { status } });
  }

  async findByClientIdAndVendorId(
    clientId: any,
    vendorId: any
  ): Promise<IBookingEntity | null> {
    return await bookingModel.findOne({ userId: clientId, vendorId }).exec();
  }

  async updateClientApproved(id: any): Promise<IBookingEntity | null> {
    console.log('in client approval repostory : ',id);
    return await bookingModel.findOneAndUpdate(
      { _id: id },
      { $set: { isClientApproved: true } },
      { new: true }
    );
  }

  async updateVendorApproved(id: any): Promise<IBookingEntity | null> {
    console.log('in vendor approval repostory : ',id);
    return await bookingModel.findOneAndUpdate(
      { _id : id },
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
        .populate({ path: "vendorId", select: "name" })
        .populate({ path: "userId", select: "name" })
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
        "name email profileImage onlineStatus"
      )
      .exec();
  }

  async findByVendorId(vendorId: any): Promise<IBookingEntity[]> {
    return await bookingModel.find({ vendorId })
      .populate("userId", "name email profileImage onlineStatus")
      .exec();
  }

  async findContactsForChat(userId: string, userType: TRole): Promise<IVendorEntity[] | IClientEntity[] | null> {
    const isClient = userType == 'client';

    const result : IVendorEntity[] | IClientEntity[] = await bookingModel.aggregate([
      {
        $match : {
          [isClient ? 'userId' : 'vendorId'] : new Types.ObjectId(userId),
        },
      },
      {
        $group : {
          _id : `$${isClient ? 'vendorId' : 'userId'}`,
        },
      },
      {
        $lookup : {
          from : isClient ? 'vendors' : 'clients',
          localField: '_id',
          foreignField : '_id',
          as : 'user',
        },
      },
      {$unwind : '$user'},
      {
        $project : {
          _id : '$user._id',
          role : '$user.role',
          isOnline : '$user.isOnline',
          lastSeen : '$user.lastSeen',
          name : '$user.name',
          avatar : '$user.profileImage'
        }
      }
    ])

    console.log(' got the result from reppository : ',result);
    return result;
  }
}
