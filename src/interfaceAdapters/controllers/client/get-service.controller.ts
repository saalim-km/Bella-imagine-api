import { inject, injectable } from "tsyringe";
import { IGetServiceController } from "../../../entities/controllerInterfaces/client/get-service-controller.interface";
import { IGetServiceUsecase } from "../../../entities/usecaseInterfaces/client/get-service-usecase.interaface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class GetServiceController implements IGetServiceController {
  constructor(
    @inject("IGetServiceUsecase") private getServiceUsecase: IGetServiceUsecase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
        console.log('in getservicecontroller ');
        const {id} = req.params;
        const service = await this.getServiceUsecase.execute(id as string);
        res.status(HTTP_STATUS.OK).json(service)
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
