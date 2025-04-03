import { inject, injectable } from "tsyringe";
import { IGetPhotographerDetailsController } from "../../../entities/controllerInterfaces/client/get-photographer-details-controller.interface";
import { IGetPhotographerDetailsUsecase } from "../../../entities/usecaseInterfaces/client/get-photographer-details-usecase.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class GetPhotographerDetailsController
  implements IGetPhotographerDetailsController
{
  constructor(
    @inject("IGetPhotographerDetailsUsecase")
    private getPhotographerDetailsUsecase: IGetPhotographerDetailsUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
        const {id} = req.params
        const vendor = await this.getPhotographerDetailsUsecase.execute(id)
        res.status(HTTP_STATUS.OK).json(vendor)
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
