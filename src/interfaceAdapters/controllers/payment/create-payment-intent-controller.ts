import { ICreatePaymentIntentController } from "../../../entities/controllerInterfaces/payment/create-payment-intent-controller.interface";
import { ICreatePaymentIntentUseCase } from "../../../entities/usecaseInterfaces/payment/create-payment-intent-usecase.interface";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { ICreateNewBookingUseCase } from "../../../entities/usecaseInterfaces/booking/create-new-booking-usecase.interface";
import { IPaymentRepository } from "../../../entities/repositoryInterfaces/payment/payment-repository.interface";
import { IBookingRepository } from "../../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { ZodError } from "zod";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class CreatePaymentIntentController
  implements ICreatePaymentIntentController
{
  constructor(
    @inject("ICreatePaymentIntentUseCase")
    private createPaymentIntentUseCase: ICreatePaymentIntentUseCase,
    @inject("ICreateNewBookingUseCase")
    private createNewBookingUseCase: ICreateNewBookingUseCase,
    @inject("IPaymentRepository") private paymentRepository: IPaymentRepository,
    @inject("IBookingRepository") private bookingRepository: IBookingRepository
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      console.log('in CreatePaymentIntentController');
      console.log(req.body);
      const userId = (req as CustomRequest).user._id;
      const {
        amount,
        currency = "inr",
        purpose,
        bookingData,
        createrType,
        receiverType,
      } = req.body;

      const amountInCents = Math.round(amount * 100);

      if (!amount || amount <= 0) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ success: false, message: "Invalid amount" });
        return;
      }

      if (!purpose.trim()) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ success: false, message: "Invalid purpose" });
        return;
      }

      if (!userId) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ success: false, message: "User ID is required" });
        return;
      }

      if (purpose === "vendor-booking") {
        const newBooking = await this.createNewBookingUseCase.execute(
          userId,
          bookingData.vendorId,
          bookingData
        );

        if (!newBooking) {
          res
            .status(HTTP_STATUS.BAD_REQUEST)
            .json({ success: false, message: "Invalid booking data" });
          return;
        }

        const { paymentIntent, clientSecret } =
          await this.createPaymentIntentUseCase.execute(
            amountInCents,
            currency,
            purpose,
            userId,
            bookingData.vendorId,
            createrType,
            receiverType,
            newBooking?._id as string
          );

        console.log(
          "in create payment controller =>",
          paymentIntent,
          clientSecret
        );

        const paymentDetails =
          await this.paymentRepository.findByPaymentIntentId(paymentIntent);

        await this.bookingRepository.findByIdAndUpdatePaymentId(
          newBooking._id,
          paymentDetails?._id
        );

        res.json({
          success: true,
          message: "Booking completed and payment successfull.",
          clientSecret,
        });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          message: err.message,
        }));
        console.log(errors);
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.VALIDATION_ERROR,
          errors,
        });
        return;
      }
      if (error instanceof CustomError) {
        console.log(error);
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
        return;
      }
      console.log(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }
}
