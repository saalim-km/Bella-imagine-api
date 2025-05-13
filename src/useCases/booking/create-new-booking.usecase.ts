import { inject, injectable } from "tsyringe";
import { Booking, IBookingEntity } from "../../entities/models/booking.entity";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IServiceRepository } from "../../entities/repositoryInterfaces/service/service-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { ICreateNewBookingUseCase } from "../../entities/usecaseInterfaces/booking/create-new-booking-usecase.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ICreateConversationUseCase } from "../../entities/usecaseInterfaces/chat/create-conversation-usecase.interface";

@injectable()
export class CreateNewBookingUseCase implements ICreateNewBookingUseCase {
  constructor(
    @inject("IBookingRepository") private bookingRepository: IBookingRepository,
    @inject("IServiceRepository") private serviceRepository: IServiceRepository,
    @inject("IVendorRepository") private vendorRepository: IVendorRepository,
    @inject("ICreateConversationUseCase")
    private createConversationUsecase: ICreateConversationUseCase
  ) {}

  async execute(
    userId: any,
    vendorId: any,
    data: Booking
  ): Promise<IBookingEntity | null> {
    const isVendorExistsWithId = await this.vendorRepository.findById(vendorId);

    if (!isVendorExistsWithId) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const service = await this.serviceRepository.findById(data.serviceId);

    if (!service) {
      throw new CustomError(ERROR_MESSAGES.WRONG_ID, HTTP_STATUS.BAD_REQUEST);
    }

    const availableDateEntry = service.availableDates.find(
      (availableDate) => availableDate.date === data.bookingDate
    );

    if (!availableDateEntry) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_BOOKING_DATE,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const timeSlot = availableDateEntry.timeSlots.find(
      (slot) =>
        slot.startTime === data.timeSlot.startTime &&
        slot.endTime === data.timeSlot.endTime
    );

    if (!timeSlot) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_TIME_SLOT,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (timeSlot.capacity === 0) {
      throw new CustomError(
        ERROR_MESSAGES.TIME_SLOT_FULL,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this.serviceRepository.saveCount(
      service._id!,
      data.bookingDate,
      data.timeSlot.startTime,
      data.timeSlot.endTime
    );

    const serviceDetails = {
      serviceTitle: service.serviceTitle,
      serviceDescription: service.serviceDescription,
      cancellationPolicies: service.cancellationPolicies,
      termsAndConditions: service.termsAndConditions,
    };

    const newBooking = await this.bookingRepository.save({
      userId,
      serviceDetails,
      bookingDate: data.bookingDate,
      timeSlot: data.timeSlot,
      vendorId,
      totalPrice: data.totalPrice,
      location: {
        lat: data.location.lat,
        lng: data.location.lng,
      },
    });

    if (!newBooking || !newBooking._id) {
      throw new CustomError(
        "error creating booking please try again later",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // creating chat conversation straight out a booking creation
    await this.createConversationUsecase.execute(
      userId,
      vendorId,
      newBooking._id as string
    );
    return newBooking;
  }
}
