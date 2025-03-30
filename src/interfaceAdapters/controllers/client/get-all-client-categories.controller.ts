import { inject, injectable } from "tsyringe";
import { IGetAllClientCategoriesController } from "../../../entities/controllerInterfaces/client/get-all-client-categories-controller.interface";
import { Request, Response } from "express";
import { IGetAllClientCategoriesUsecase } from "../../../entities/usecaseInterfaces/client/get-all-client-categories-usecase.interface";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class GetAllClientCategoriesController
  implements IGetAllClientCategoriesController
{
  constructor(
    @inject("IGetAllClientCategoriesUsecase")
    private getAllClientCategoriesUsecase: IGetAllClientCategoriesUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.getAllClientCategoriesUsecase.execute();
      res.status(HTTP_STATUS.OK).json({success : true , data : categories})
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
