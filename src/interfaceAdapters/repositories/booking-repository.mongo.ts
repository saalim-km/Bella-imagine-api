import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IBooking } from "../../domain/models/booking";
import {
  FindBookingsInput,
  IBookingRepository,
} from "../../domain/interfaces/repository/booking.repository";
import { Booking } from "../database/schemas/booking.schema";
import { Types } from "mongoose";
import { PaymentStatus } from "../../domain/models/payment";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";

@injectable()
export class BookingRepository
  extends BaseRepository<IBooking>
  implements IBookingRepository
{
  constructor() {
    super(Booking);
  }

  async findByIdAndUpdatePaymentStatus(
    bookingId: Types.ObjectId,
    status: PaymentStatus
  ): Promise<void> {
    await this.update(bookingId, { paymentStatus: status });
  }

  async findBookings(
    input: FindBookingsInput
  ): Promise<PaginatedResponse<IBooking>> {
    const {
      page,
      limit,
      sort,
      search,
      statusFilter,
      dateFrom,
      dateTo,
      priceMin,
      priceMax,
      userId,
      vendorId
    } = input;

    // Build MongoDB query
    const query: any = {};

    // Role-based filtering
    if (userId && userId !== undefined) {
      query.userId = userId;
    }

    if(vendorId && vendorId !== undefined) {
      query.vendorId = vendorId
    }

    // Status filter
    if (statusFilter && statusFilter !== "all") {
      query.status = statusFilter;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.bookingDate = {};
      if (dateFrom) {
        query.bookingDate.$gte = dateFrom;
      }
      if (dateTo) {
        query.bookingDate.$lte = dateTo;
      }
    }

    // Price range filter
    if (priceMin !== undefined || priceMax !== undefined) {
      query.totalPrice = {};
      if (priceMin !== undefined) {
        query.totalPrice.$gte = priceMin;
      }
      if (priceMax !== undefined) {
        query.totalPrice.$lte = priceMax;
      }
    }

    // Search filter (case-insensitive search on service title and vendor name)
    if (search) {
      query.$or = [
        { "serviceDetails.serviceTitle": { $regex: search, $options: "i" } },
        { "vendorId.name": { $regex: search, $options: "i" } },
      ];
    }

    // Build sort options
    const sortOptions: any = {};
    if (sort) {
      const isDescending = sort.startsWith("-");
      const field = isDescending ? sort.slice(1) : sort;
      sortOptions[field] = isDescending ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Default sort by createdAt descending
    }

    // Execute query with pagination
    const [data, total] = await Promise.all([
      Booking
        .find(query)
        .populate({ path: "vendorId", select: "name" })
        .populate({ path: "userId", select: "name" })
        .sort({createdAt : -1})
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.count(query),
    ]);

    return { data, total };
  }
}
