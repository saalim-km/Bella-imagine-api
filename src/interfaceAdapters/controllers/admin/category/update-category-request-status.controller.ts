import { inject, injectable } from "tsyringe";
import { IUpdateCategoryRequestStatusController } from "../../../../entities/controllerInterfaces/admin/category/update-category-request-status-controller.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../../shared/constants";
import { CustomError } from "../../../../entities/utils/custom-error";
import { ICategoryRequest } from "../../../../shared/types/admin/admin.type";
import { IUpdateCategoryRequestStatusUsecase } from "../../../../entities/usecaseInterfaces/admin/category/update-category-request-status-usecase.interface";

@injectable()
export class UpdateCategoryRequestStatusController
  implements IUpdateCategoryRequestStatusController
{
  constructor(
    @inject("IUpdateCategoryRequestStatusUsecase") private updateCategoryRequestStatusUsecase : IUpdateCategoryRequestStatusUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
        console.log(req.body);
        const {vendorId,categoryId,status} = req.body as ICategoryRequest
        await this.updateCategoryRequestStatusUsecase.execute(vendorId,categoryId,status);
        res.status(HTTP_STATUS.OK).json({success : true , message : SUCCESS_MESSAGES.UPDATE_SUCCESS})

  }
}
