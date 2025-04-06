import { inject, injectable } from "tsyringe";
import { IGetAllVendorCateoriesController } from "../../../entities/controllerInterfaces/vendor/get-all-vendor-categories-controller.interface";
import { IGetAllVendorCategoriesUsecase } from "../../../entities/usecaseInterfaces/vendor/get-all-vendor-categories-usecase.interface";
import { Request, Response } from "express";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { ZodError } from "zod";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class GetAllVendorCategoriesController
  implements IGetAllVendorCateoriesController
{
  constructor(
    @inject("IGetAllVendorCategoriesUsecase")
    private allVendorCategoriesUsecase: IGetAllVendorCategoriesUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
        // console.log('-----------------------------GetAllVendorCategoriesController-------------------------------');
      const categories = await this.allVendorCategoriesUsecase.execute();
      res
        .status(HTTP_STATUS.OK)
        .json({ success: true, categories: categories });
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
