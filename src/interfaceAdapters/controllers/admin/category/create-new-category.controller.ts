import { Request, Response } from "express";
import { ICreateNewCategoryController } from "../../../../entities/controllerInterfaces/admin/category/create-new-category-controller.interafce";
import { ICreateNewCategoryUseCase } from "../../../../entities/usecaseInterfaces/admin/category/create-new-category-usecase.interface";
import { ZodError } from "zod";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../../shared/constants";
import { CustomError } from "../../../../entities/utils/custom-error";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateNewCategoryController
  implements ICreateNewCategoryController
{
  constructor(
    @inject("ICreateNewCategoryUseCase")
    private createNewCategoryUseCase: ICreateNewCategoryUseCase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
        console.log('-------------------CreateNewCategoryController--------------------');
        console.log(req.body);
      const { title , status} = req.body as { title: string , status : boolean};

      await this.createNewCategoryUseCase.execute(title , status);

      res
        .status(HTTP_STATUS.CREATED)
        .json({ success: true, message : SUCCESS_MESSAGES.CREATED });

  }
}
