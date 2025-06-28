import { inject, injectable } from "tsyringe";
import {
  CreatePaymentIntentInput,
  updateBookingStatusInput,
} from "../../domain/interfaces/usecase/types/client.types";
import { IBookingRepository } from "../../domain/interfaces/repository/booking.repository";
import { IServiceRepository } from "../../domain/interfaces/repository/service.repository";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { BOOKING_CONFIRMATION_MAIL_CONTENT, ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { IClientRepository } from "../../domain/interfaces/repository/client.repository";
import { IWalletRepository } from "../../domain/interfaces/repository/wallet.repository";
import { IBookingCommandUsecase } from "../../domain/interfaces/usecase/booking-usecase.interface";
import { IPaymentUsecaase } from "../../domain/interfaces/usecase/payment.usecase";
import { IPayment } from "../../domain/models/payment";
import { IBooking } from "../../domain/models/booking";
import { IWalletUsecase } from "../../domain/interfaces/usecase/wallet-usecase.interface";
import { Types } from "mongoose";
import { IConversationRepository } from "../../domain/interfaces/repository/conversation.repository";
import { IChatUsecase } from "../../domain/interfaces/usecase/chat-usecase.interface";
import { IEmailService } from "../../domain/interfaces/service/email-service.interface";
import { TimeSlot } from "../../shared/types/service.types";

@injectable()
export class BookingCommandUsecase implements IBookingCommandUsecase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("IServiceRepository")
    private _serviceRepository: IServiceRepository,
    @inject("IClientRepository") private _clientRepository: IClientRepository,
    @inject("IWalletRepository") private _walletRepository: IWalletRepository,
    @inject("IPaymentUsecaase") private _paymentUsecase: IPaymentUsecaase,
    @inject("IWalletUsecase") private _walletUsecase: IWalletUsecase,
    @inject("IChatUsecase") private _chatUsecase: IChatUsecase,
    @inject('IEmailService') private _emailService : IEmailService
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
    if (!service || !service._id) {
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

    const isSlotAvailable = await this._serviceRepository.checkCapacityExeeds({
       date : bookingDate,
       timeSlot : timeSlot as TimeSlot
    })

    const adminCommission = ( totalPrice / 100 ) * 2;
    const newBooking = await this._bookingRepository.create({
      bookingDate: bookingDate,
      customLocation: customLocation || "",
      distance: distance || 0,
      travelFee: travelFee || 0,
      travelTime: travelTime || "",
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
      adminCommision : adminCommission,
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
    };
    const paymentIntent = await this._paymentUsecase.createPaymentIntent(
      paymentIntentData
    );


    if (!paymentIntent || !paymentIntent.client_secret) {
      throw new CustomError(
        ERROR_MESSAGES.PAYMENT_INTENT_CREATION_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    const paymentData: IPayment = {
      userId: clientId,
      receiverId: vendorId,
      createrType: "Client",
      receiverType: "Vendor",
      transactionId: `TXN_${Date.now()}`,
      amount: totalPrice,
      paymentIntentId: paymentIntent.id,
      bookingId: newBooking._id,
      purpose: purpose,
      currency: "inr",
      status: "pending",
    };
    const newPayment = await this._paymentUsecase.processPayment(paymentData);

      
    await Promise.all([
      this._emailService.send(client.email,'Your Bella Imagine Booking is Confirmed 🎟️',BOOKING_CONFIRMATION_MAIL_CONTENT({date : bookingDate , eventName : service.serviceTitle ,time : `${timeSlot.startTime} - ${timeSlot.endTime}` , stripeReceipt : 'nice'})),
      this._bookingRepository.update(newBooking._id, {
        paymentId: newPayment._id,
      }),
      this._walletRepository.addPaymnetIdToWallet(clientId, newPayment._id!),
      this._serviceRepository.updateSlotCount(newBooking, -1),
      this._chatUsecase.createConversation({
        clientId: clientId,
        vendorId: vendorId,
        bookingId: newBooking._id,
      }),
    ]);

    return paymentIntent.client_secret;
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

    if (booking.status === "completed" || booking.status === "cancelled") {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_ALREADY_COMPLETED_OR_CANCELLED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (status === "confirmed") {
      console.log(" entering confirmed status update logic");
      await this._bookingRepository.update(bookingId, {
        status: "confirmed",
      });
      return;
    }

    if (status === "cancelled") {
      await this.cancelBooking(bookingId);
      return;
    }

    if (status === "completed") {
      console.log("entering completed status update logic");
      const isClient = booking.userId.toString() === userId.toString();
      const isVendor = booking.vendorId.toString() === userId.toString();

      if (!isClient && !isVendor) {
        throw new CustomError(
          ERROR_MESSAGES.UNAUTHORIZED_USER,
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      const updateFields: Partial<IBooking> = {};
      if (isClient) {
        updateFields.isClientApproved = true;
      } else if (isVendor) {
        updateFields.isVendorApproved = true;
      }

      const updatedBooking = await this._bookingRepository.update(bookingId, {
        ...updateFields,
      });

      if (!updatedBooking) {
        throw new CustomError(
          ERROR_MESSAGES.BOOKING_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      if (updatedBooking.isClientApproved && updatedBooking.isVendorApproved) {
        const amountForVendor = updatedBooking.totalPrice - (updatedBooking.totalPrice / 100) * 2

          await this._bookingRepository.update(bookingId, {
            status: "completed",
          }),

        await Promise.all([
        this._walletUsecase.creditAdminCommissionToWallet(bookingId),
        this._walletUsecase.creditAmountToWallet({
          amount : amountForVendor,
          purpose: "wallet-credit",
          bookingId: bookingId,
          userId : updatedBooking.vendorId,
        })
        ])
         
      }
      return;
    }

    throw new CustomError(
      ERROR_MESSAGES.INVALID_BOOKING_STATUS,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  async cancelBooking(bookingId: Types.ObjectId): Promise<void> {
    const booking = await this._bookingRepository.findById(bookingId);
    if (!booking) {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    const bookingDate = new Date(booking.bookingDate);
    const now = new Date();

    const hoursDiff =
      (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursDiff < 24) {
      throw new CustomError(
        "Cancellations must be made at least 24 hours in advance.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await Promise.all([
      this._walletUsecase.creditAmountToWallet({
        amount: booking.totalPrice,
        purpose: "refund-amount",
        bookingId: bookingId,
        userId: booking.userId,
      }),
      this._bookingRepository.update(bookingId, {
        status: "cancelled",
      }),
      this._serviceRepository.updateSlotCount(booking, 1),
    ]);
  }
}
