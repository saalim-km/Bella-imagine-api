import { Request, Response } from "express";
import { IConfirmPaymenController } from "../../../entities/controllerInterfaces/payment/confirm-payment-controller.interface";
import { IConfirmPaymentUseCase } from "../../../entities/usecaseInterfaces/payment/confirm-payment.usecase";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { inject, injectable } from "tsyringe";
import { ZodError } from "zod";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class ConfirmPaymentController implements IConfirmPaymenController {
  constructor(
    @inject("IConfirmPaymentUseCase")
    private confirmPaymentUseCase: IConfirmPaymentUseCase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { paymentIntentId } = req.body;

      if (!paymentIntentId) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ success: false, message: "Payment intent ID is required" });
        return;
      }

      const isConfirmed = await this.confirmPaymentUseCase.execute(
        paymentIntentId
      );
      res.json({ success: isConfirmed, message: "Payment Confirmed" });
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
