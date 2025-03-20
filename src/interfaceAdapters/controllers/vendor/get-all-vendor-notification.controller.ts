import { inject, injectable } from "tsyringe";
import { IGetAllVendorNotificationController } from "../../../entities/controllerInterfaces/vendor/get-all-notifications-controller.interface";
import { IGetAllVendorNotificationUsecase } from "../../../entities/usecaseInterfaces/vendor/get-all-vendor-notification-usecase.interface";
import { Request, Response } from "express";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { ZodError } from "zod";
import { CustomError } from "../../../entities/utils/custom-error";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class GetAllVendorNotificationController
  implements IGetAllVendorNotificationController
{
  constructor(
    @inject("IGetAllVendorNotificationUsecase")
    private getAllVendorNotificationUsecase: IGetAllVendorNotificationUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      console.log("in GetAllVendorNotificationController");
      const receiverId = (req as CustomRequest).user._id;
      const notifications =
        await this.getAllVendorNotificationUsecase.execute(receiverId);
      res.status(HTTP_STATUS.OK).json({ success: true, notifications });
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
