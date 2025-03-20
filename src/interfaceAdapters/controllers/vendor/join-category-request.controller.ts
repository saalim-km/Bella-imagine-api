import { Request, Response } from "express";
import { IJoinCategoryRequestController } from "../../../entities/controllerInterfaces/vendor/join-category-request.controller.interface";
import { IJoinCategoryRequestUsecase } from "../../../entities/usecaseInterfaces/vendor/join-category-reqeust-usecase.interface";
import { ZodError } from "zod";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { inject, injectable } from "tsyringe";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class JoinCategoryRequestController implements IJoinCategoryRequestController {
  constructor(
    @inject("IJoinCategoryRequestUseCase")
    private joinCategoryRequestUseCase: IJoinCategoryRequestUsecase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.body;
      const vendorId = (req as CustomRequest).user._id;
      await this.joinCategoryRequestUseCase.execute(vendorId as any, category);
      console.log(category,vendorId);
      res
        .status(HTTP_STATUS.OK)
        .json({ success: true, message: SUCCESS_MESSAGES.ACTION_SUCCESS });
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          message: err.message,
        }));

        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.VALIDATION_ERROR,
          errors,
        });
        return;
      }
      if (error instanceof CustomError) {
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
