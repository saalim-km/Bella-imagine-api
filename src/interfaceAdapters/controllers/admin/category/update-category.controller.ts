import { inject, injectable } from "tsyringe";
import { IUpdateCategoryController } from "../../../../entities/controllerInterfaces/admin/category/update-category-controller.interface";
import { Request, Response } from "express";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../../shared/constants";
import { ZodError } from "zod";
import { CustomError } from "../../../../entities/utils/custom-error";
import { IUpdateCategoryUsecase } from "../../../../entities/usecaseInterfaces/admin/category/update-category-usecase.interface";

@injectable()
export class UpdateCategoryController implements IUpdateCategoryController {
  constructor(
    @inject("IUpdateCategoryUsecase")
    private updateCategoryUsecase: IUpdateCategoryUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id, data } = req.body;
      await this.updateCategoryUsecase.execute(id, data);
      res
        .status(HTTP_STATUS.OK)
        .json({ success: true, message: SUCCESS_MESSAGES.UPDATE_SUCCESS });
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
