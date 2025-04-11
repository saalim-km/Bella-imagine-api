import { Request, Response } from "express";
import { IUpdateBookingStatusController } from "../../../entities/controllerInterfaces/booking/update-booking-status-controller.interface";
import { IUpdateBookingStatusUseCase } from "../../../entities/usecaseInterfaces/booking/update-booking-status-usecse.interface";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { inject, injectable } from "tsyringe";
import { ICancelBookingUseCase } from "../../../entities/usecaseInterfaces/booking/cancel-booking-usecase.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class UpdateBookingStatusController
  implements IUpdateBookingStatusController
{
  constructor(
    @inject("IUpdateBookingStatusUseCase")
    private updateBookingStatusUseCase: IUpdateBookingStatusUseCase,
    @inject("ICancelBookingUseCase")
    private cancelBookingUseCase: ICancelBookingUseCase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user._id;
    const { bookingId, status } = req.query;

    if (!bookingId) {
      throw new CustomError(
        ERROR_MESSAGES.ID_REQUIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const statusString = typeof status === "string" ? status : "";

    if (status === "cancelled") {
      await this.cancelBookingUseCase.execute(bookingId);
    } else if (status === "confirmed" || status === "completed") {
      await this.updateBookingStatusUseCase.execute(
        userId,
        bookingId,
        statusString
      );
    }

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.UPDATE_SUCCESS });
  }
}