import { inject, injectable } from "tsyringe";
import { ICreateServiceController } from "../../../entities/controllerInterfaces/vendor/create-service-controller.interface";
import { ICreateServiceUsecase } from "../../../entities/usecaseInterfaces/service/create-service-usecase.interface";
import { ZodError } from "zod";
import { Request, Response } from "express";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { IServiceEntity } from "../../../entities/models/service.entity";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class CreateServiceController implements ICreateServiceController {
  constructor(
    @inject("ICreateServiceUsecase") private createServiceUsecase: ICreateServiceUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
        // console.log('in CreateServiceController');
        // console.log(req.body);
        const user = (req as CustomRequest).user
        const data = req.body as IServiceEntity;
        await this.createServiceUsecase.execute(data,user._id)
        res.status(HTTP_STATUS.OK).json({success : true , message : data.isPublished ? "Service Created Successfully" : "Service Drafted Successfully"})
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
