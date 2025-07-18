import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IService } from "../../domain/models/service";
import { IServiceRepository } from "../../domain/interfaces/repository/service.repository";
import { Service } from "../database/schemas/service.schema";
import { IBooking } from "../../domain/models/booking";
import { FilterQuery } from "mongoose";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";

@injectable()
export class ServiceRepository
  extends BaseRepository<IService>
  implements IServiceRepository
{
  constructor() {
    super(Service);
  }

  async updateSlotCount(booking: IBooking, count: number): Promise<void> {
    const { bookingDate, timeSlot, serviceDetails } = booking;

    const result = await this.model.updateOne(
      {
        _id: serviceDetails._id,
        "availableDates.date": bookingDate,
        "availableDates.timeSlots": {
          $elemMatch: {
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime,
            capacity: { $gte: count < 0 ? Math.abs(count) : 0 },
          },
        },
      },
      {
        $inc: {
          "availableDates.$[dateElem].timeSlots.$[slotElem].capacity": count,
        },
      },
      {
        arrayFilters: [
          { "dateElem.date": bookingDate },
          {
            "slotElem.startTime": timeSlot.startTime,
            "slotElem.endTime": timeSlot.endTime,
            "slotElem.capacity": { $gte: count < 0 ? Math.abs(count) : 0 },
          },
        ],
      }
    );

    if (result.modifiedCount === 0) {
      throw new CustomError(
        ERROR_MESSAGES.TIME_SLOT_FULLY_BOOKED,
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }

  async getServices(
    filter: FilterQuery<IService>,
    skip: number,
    limit: number,
    sort: any = -1
  ): Promise<PaginatedResponse<IService>> {
    const [services, count] = await Promise.all([
      this.model
        .find(filter)
        .populate({ path: "category", select: "title" })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.model.countDocuments(filter),
    ]);

    return {
      data: services,
      total: count,
    };
  }

  async incrementSlot(booking: IBooking): Promise<void> {
    const { bookingDate, timeSlot, serviceDetails } = booking;

    await this.model.updateOne(
      {
        _id: serviceDetails._id,
        "availableDates.date": bookingDate,
        "availableDates.timeSlots": {
          $elemMatch: {
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime,
          },
        },
      },
      {
        $inc: {
          "availableDates.$[dateElem].timeSlots.$[slotElem].capacity": 1,
        },
      },
      {
        arrayFilters: [
          { "dateElem.date": bookingDate },
          {
            "slotElem.startTime": timeSlot.startTime,
            "slotElem.endTime": timeSlot.endTime,
          },
        ],
      }
    );
  }
}
