import { inject, injectable } from "tsyringe";
import { IUpdateVendorController } from "../../../entities/controllerInterfaces/vendor/update-vendor-profile-controller.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IUpdateVendorProfileUsecase } from "../../../entities/usecaseInterfaces/vendor/update-vendor-profile-usecase.interface";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class UpdateVendorController implements IUpdateVendorController {
  constructor(
    @inject("IUpdateVendorProfileUsecase")
    private updateVendorProfileUsecase: IUpdateVendorProfileUsecase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      console.log(
        "-----------------------update vendor controller-------------------"
      );
      console.log(req.body);
      const user = (req as CustomRequest).user;
      await this.updateVendorProfileUsecase.execute(user._id, req.body);

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
