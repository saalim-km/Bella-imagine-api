import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../../shared/constants";
import { CustomError } from "../../../../entities/utils/custom-error";
import { IGetCategoryRequestUsecase } from "../../../../entities/usecaseInterfaces/admin/category/get-category-request-usecase.interface";

@injectable()
export class GetCategoryRequestController {
  constructor(
    @inject("IGetCategoryRequestUsecase")
    private getCategoryRequestUsecase: IGetCategoryRequestUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
      const categoryRequest = await this.getCategoryRequestUsecase.execute();
      console.log(categoryRequest);
      res.status(HTTP_STATUS.OK).json({ success: true, categoryRequest });

  }
}