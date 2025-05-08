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
      console.log(req.body);
      const { id, data } = req.body;
      await this.updateCategoryUsecase.execute(id, data);
      res
        .status(HTTP_STATUS.OK)
        .json({ success: true, message: SUCCESS_MESSAGES.UPDATE_SUCCESS });

  }
}
