import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { IGetCategoryRequestUsecase } from "../../../entities/usecaseInterfaces/admin/get-category-request-usecase.interface";

@injectable()
export class GetCategoryRequestController {
  constructor(
    @inject("IGetCategoryRequestUsecase")
    private getCategoryRequestUsecase: IGetCategoryRequestUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const categoryRequest = await this.getCategoryRequestUsecase.execute();
      console.log(categoryRequest);
      res.status(HTTP_STATUS.OK).json({ success: true, categoryRequest });
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