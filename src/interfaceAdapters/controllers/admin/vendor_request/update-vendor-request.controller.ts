import { inject, injectable } from "tsyringe";
import { IUpdateVendorRequestController } from "../../../../entities/controllerInterfaces/admin/vendor_request/update-vendor-reqeust-controller.interface";
import { IUpdateVendorRequestUsecase } from "../../../../entities/usecaseInterfaces/admin/vendor_request/update-vendor-request-usecase.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../../../middlewares/auth.middleware";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../../shared/constants";
import { CustomError } from "../../../../entities/utils/custom-error";

@injectable()
export class UpdateVendorRequestController
  implements IUpdateVendorRequestController
{
  constructor(
    @inject("IUpdateVendorRequestUsecase")
    private updateVendorRequestUsecaes: IUpdateVendorRequestUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
        console.log('---------------------------UpdateVendorRequestController----------------------');
      const {vendorId , rejectReason , status} : {vendorId : string ,rejectReason : string , status : 'reject' | 'accept' } = req.body;
      const user = (req as CustomRequest).user;

      await this.updateVendorRequestUsecaes.execute(user._id,vendorId,status,rejectReason)
      res.status(HTTP_STATUS.OK).json({success : true , message : SUCCESS_MESSAGES.UPDATE_SUCCESS})
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
