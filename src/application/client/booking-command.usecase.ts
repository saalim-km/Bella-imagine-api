import { inject, injectable } from "tsyringe";
import { IBookingCommandUsecase } from "../../domain/interfaces/usecase/client-usecase.interface";
import { CreatePaymentIntentInput } from "../../domain/interfaces/usecase/types/client.types";
import { IBookingRepository } from "../../domain/interfaces/repository/booking.repository";
import { IServiceRepository } from "../../domain/interfaces/repository/service.repository";
import { CustomError } from "../../shared/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { IStripeService } from "../../domain/interfaces/service/stripe-service.interface";
import { IClientRepository } from "../../domain/interfaces/repository/client.repository";
import { IPaymentRepository } from "../../domain/interfaces/repository/payment.repository";

@injectable()
export class BookingCommandUsecase implements IBookingCommandUsecase {
  constructor(
    @inject("IBookingRepository") private _bookingRepository: IBookingRepository,
    @inject('IServiceRepository') private _serviceRepository : IServiceRepository,
    @inject('IStripeService') private _stripeService : IStripeService,
    @inject('IClientRepository') private _clientRepository : IClientRepository,
    @inject('IPaymentRepository') private _paymentRepository : IPaymentRepository
  ) {}

  async createPaymentIntentAndBooking(
    input: CreatePaymentIntentInput
  ): Promise< string > {
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
      receiverType
    } = input;

    const service = await this._serviceRepository.findById(serviceId)

    if(!service) {
        throw new CustomError(ERROR_MESSAGES.SERVICE_NOT_FOUND , HTTP_STATUS.NOT_FOUND)
    }
    const client = await this._clientRepository.findById(clientId)
    if(!client){
      throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
    }

    const newBooking = await this._bookingRepository.create({
      bookingDate : bookingDate,
      customLocation : customLocation || '',
      distance : distance || 0,
      travelFee : travelFee || 0,
      location : location && typeof location.lat === 'number' && typeof location.lng === 'number'
        ? { lat: location.lat, lng: location.lng }
        : { lat: 0, lng: 0 },
      userId : clientId,
      vendorId : vendorId,
      serviceDetails : {
        _id : service._id,
        cancellationPolicies : service.cancellationPolicies,
        serviceDescription: service.serviceDescription,
        serviceTitle : service.serviceTitle,
        termsAndConditions : service.termsAndConditions
      },
      timeSlot : timeSlot,
      totalPrice: totalPrice,
      paymentStatus : 'pending',
      status : 'pending',
    })

    console.log('new booking created : ',newBooking);

    const paymentIntent = await this._stripeService.createPaymentIntent({
      amount : totalPrice,
      currency : 'inr',
      receiptEmail: client.email,
      description : purpose,
      metadata : {
        bookingId : newBooking._id.toString(),
        clientId : clientId.toString(),
        vendorId : vendorId.toString()
      }
    })
    if(!paymentIntent.client_secret) {
      throw new CustomError(ERROR_MESSAGES.FAILED_TO_PROCESS_REFUND,HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }

    const newPayment = await this._paymentRepository.create({
      userId : clientId,
      receiverId : vendorId,
      createrType : 'Client',
      receiverType : 'Vendor',
      transactionId : `TXN_${Date.now()}`,
      amount : totalPrice,
      paymentIntentId : paymentIntent.id,
      bookingId : newBooking._id,
      purpose : purpose,
      currency : 'inr',
    })

    console.log('new payment created : ',newPayment);
    const updatedBooking = await this._bookingRepository.update(newBooking._id,{paymentId : newPayment._id})
    console.log('updated booking : ',updatedBooking);

    return paymentIntent.client_secret
  }
}
