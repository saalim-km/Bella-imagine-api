import { inject, injectable } from "tsyringe";
import { IUpdateVendorController } from "../../../entities/controllerInterfaces/vendor/update-vendor-profile-controller.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IUpdateVendorProfileUsecase } from "../../../entities/usecaseInterfaces/vendor/update-vendor-profile-usecase.interface";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { IAwsS3Service } from "../../../entities/services/awsS3-service.interface";
import path from "path";
import { unlinkSync } from "fs";

@injectable()
export class UpdateVendorController implements IUpdateVendorController {
  constructor(
    @inject("IUpdateVendorProfileUsecase") 
    private updateVendorProfileUsecase: IUpdateVendorProfileUsecase,
    @inject('IAwsS3Service') private awsS3Service : IAwsS3Service
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as CustomRequest).user;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const updateData = { ...req.body };

      const vendor = await this.updateVendorProfileUsecase.execute(user._id, updateData, files);
      res.status(HTTP_STATUS.OK).json({ success: true, message: SUCCESS_MESSAGES.UPDATE_SUCCESS, vendor });
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({ message: err.message }));
         res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.VALIDATION_ERROR, errors });
         return
      }
      if (error instanceof CustomError) {
         res.status(error.statusCode).json({ success: false, message: error.message });
         return
      }
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }
}
