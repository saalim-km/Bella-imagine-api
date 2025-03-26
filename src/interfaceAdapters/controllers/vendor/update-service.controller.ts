import { inject, injectable } from "tsyringe";
import { IUpdateServiceController } from "../../../entities/controllerInterfaces/vendor/update-service-controller.interface";
import { IUpdateServiceUsecase } from "../../../entities/usecaseInterfaces/service/update-service-usecase.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { IServiceEntity } from "../../../entities/models/service.entity";

@injectable()
export class UpdateServiceController implements IUpdateServiceController {
  constructor(
    @inject("IUpdateServiceUsecase")
    private updateServiceUsecase: IUpdateServiceUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
        console.log(req.body);
        await this.updateServiceUsecase.execute(req.body as IServiceEntity)
        res.status(HTTP_STATUS.OK).json({success : true , message : SUCCESS_MESSAGES.UPDATE_SUCCESS})
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
