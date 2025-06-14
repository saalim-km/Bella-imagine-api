import { inject, injectable } from "tsyringe";
import {
  CreatePaymentIntentInput,
  updateBookingStatusInput,
} from "../../domain/interfaces/usecase/types/client.types";
import { IBookingRepository } from "../../domain/interfaces/repository/booking.repository";
import { IServiceRepository } from "../../domain/interfaces/repository/service.repository";
import { CustomError } from "../../shared/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { IStripeService } from "../../domain/interfaces/service/stripe-service.interface";
import { IClientRepository } from "../../domain/interfaces/repository/client.repository";
import { IPaymentRepository } from "../../domain/interfaces/repository/payment.repository";
import { IWalletRepository } from "../../domain/interfaces/repository/wallet.repository";
import { IBookingCommandUsecase } from "../../domain/interfaces/usecase/booking-usecase.interface";
import { IPaymentUsecaase } from "../../domain/interfaces/usecase/payment.usecase";
import { IPayment } from "../../domain/models/payment";
import { IBooking } from "../../domain/models/booking";

@injectable()
export class BookingCommandUsecase implements IBookingCommandUsecase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("IServiceRepository")
    private _serviceRepository: IServiceRepository,
    @inject("IClientRepository") private _clientRepository: IClientRepository,
    @inject("IWalletRepository") private _walletRepository: IWalletRepository,
    @inject('IPaymentUsecaase') private _paymentUsecase : IPaymentUsecaase
  ) {}

  async createPaymentIntentAndBooking(
    input: CreatePaymentIntentInput
  ): Promise<string> {
    const {
      clientId,
      bookingDate,
      location,
      serviceId,
      timeSlot,
      totalPrice,
      vendorId,
      customLocation,
      distance,
      travelFee,
      travelTime,
      purpose,
      createrType,
      receiverType,
    } = input;

    const service = await this._serviceRepository.findById(serviceId);

    if (!service) {
      throw new CustomError(
        ERROR_MESSAGES.SERVICE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    const client = await this._clientRepository.findById(clientId);
    if (!client) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const newBooking = await this._bookingRepository.create({
      bookingDate: bookingDate,
      customLocation: customLocation || "",
      distance: distance || 0,
      travelFee: travelFee || 0,
      travelTime : travelTime || "",
      location:
        location &&
        typeof location.lat === "number" &&
        typeof location.lng === "number"
          ? { lat: location.lat, lng: location.lng }
          : { lat: 0, lng: 0 },
      userId: clientId,
      vendorId: vendorId,
      serviceDetails: {
        _id: service._id,
        cancellationPolicies: service.cancellationPolicies,
        serviceDescription: service.serviceDescription,
        serviceTitle: service.serviceTitle,
        termsAndConditions: service.termsAndConditions,
        location: service.location,
      },
      timeSlot: timeSlot,
      totalPrice: totalPrice,
      paymentStatus: "pending",
      status: "pending",
      createrType: createrType || "Client",
      receiverType: receiverType || "Vendor",
    });

    const paymentIntentData = {
      amount: totalPrice,
      currency: "inr",
      receiptEmail: client.email,
      description: purpose,
      metadata: {
        bookingId: newBooking._id.toString(),
        clientId: clientId.toString(),
        vendorId: vendorId.toString(),
      },
    }
    const clientSecret = await this._paymentUsecase.createPaymentIntent(
      paymentIntentData
    );

    const paymentData : IPayment = {
      userId: clientId,
      receiverId: vendorId,
      createrType: "Client",
      receiverType: "Vendor",
      transactionId: `TXN_${Date.now()}`,
      amount: totalPrice,
      paymentIntentId: ,
      bookingId: newBooking._id,
      purpose: purpose,
      currency: "inr",  
      status : 'pending'    
    }
    const newPayment = await this._paymentUsecase.processPayment(paymentData);

    await Promise.all([
      this._bookingRepository.update(newBooking._id, {
        paymentId: newPayment._id,
      }),
      this._walletRepository.addPaymnetIdToWallet(clientId, newPayment._id!),
    ]);

    return clientSecret
  }

  async updateBookingStatus(input: updateBookingStatusInput): Promise<void> {
    const { bookingId, status, userId } = input;
    const booking = await this._bookingRepository.findById(bookingId);
    if (!booking) {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if(booking.status === "completed" || booking.status === "cancelled") {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_ALREADY_COMPLETED_OR_CANCELLED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if(booking.status === 'confirmed') {
      await this._bookingRepository.update(bookingId , {
        status : 'confirmed',
      })
      return;
    }

    if(status === 'completed') {
      const isClient = booking.userId.toString() === userId.toString();
      const isVendor = booking.vendorId.toString() === userId.toString();

      if(!isClient && !isVendor) {
        throw new CustomError(
          ERROR_MESSAGES.UNAUTHORIZED_USER,
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      const updateFields : Partial<IBooking> = {}
      if(isClient) {
        updateFields.isClientApproved = true;
      } else if(isVendor) {
        updateFields.isVendorApproved = true;
      }

      const updatedBooking = await this._bookingRepository.update(bookingId, {
        ...updateFields
      });

      if(!updatedBooking) {
        throw new CustomError(
          ERROR_MESSAGES.BOOKING_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      if(updatedBooking.isClientApproved && updatedBooking.isVendorApproved) {
        await this._bookingRepository.update(bookingId, {
          status: 'completed',
        });


      }
    }


    throw new CustomError(ERROR_MESSAGES.INVALID_BOOKING_STATUS, HTTP_STATUS.BAD_REQUEST);
  } 
}
