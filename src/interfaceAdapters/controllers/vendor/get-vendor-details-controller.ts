import { Request, Response } from "express";
import { IGetVendorDetailsController } from "../../../entities/controllerInterfaces/vendor/get-vendor-details-controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IGetVendorDetailsUsecase } from "../../../entities/usecaseInterfaces/vendor/get-vendor-details-usecase.interaface";
import { inject, injectable } from "tsyringe";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class GetVendorDetailsController implements IGetVendorDetailsController {
  constructor(
    @inject("IGetVendorDetailsUsecase")
    private getVendorDetailsUsecase: IGetVendorDetailsUsecase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      console.log(
        "---------------------vendor details controller---------------------"
      );
      const user = (req as CustomRequest).user;
      console.log(user);
      const vendor = await this.getVendorDetailsUsecase.execute(user._id);
      console.log('-----------------------------after getting data from the usecase in controller------------------------------')
      console.log(vendor);

      res.status(HTTP_STATUS.OK).json({success : true , vendor})

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
