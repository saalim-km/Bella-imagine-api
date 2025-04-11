import { Request, Response } from "express";
import { ICreateNewCategoryController } from "../../../entities/controllerInterfaces/admin/create-new-category-controller.interafce";
import { ICreateNewCategoryUseCase } from "../../../entities/usecaseInterfaces/admin/category/create-new-category-usecase.interface";
import { ZodError } from "zod";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
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
    try {
        console.log('-------------------CreateNewCategoryController--------------------');
        console.log(req.body);
      const { title , status} = req.body as { title: string , status : boolean};

      await this.createNewCategoryUseCase.execute(title , status);

      res
        .status(HTTP_STATUS.CREATED)
        .json({ success: true, message : SUCCESS_MESSAGES.CREATED });
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
