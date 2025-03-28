import { inject, injectable } from "tsyringe";
import { ICreateWorkSampleController } from "../../../entities/controllerInterfaces/vendor/create-work-sample-controller.usecase.interface";
import { ICreateWorkSampleUsecase } from "../../../entities/usecaseInterfaces/vendor/create-work-sample-usecase.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IWorkSampleEntity } from "../../../entities/models/work-sample.entity";

@injectable()
export class CreateWorkSampleController implements ICreateWorkSampleController {
  constructor(
    @inject("ICreateWorkSampleUsecase")
    private createWorkSampleUsecase: ICreateWorkSampleUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
        const vendor = (req as CustomRequest).user;
        const workSampleData = req.body as IWorkSampleEntity;
        workSampleData.vendor = vendor._id;
        await this.createWorkSampleUsecase.execute(workSampleData)
        res.status(HTTP_STATUS.OK).json({succes : true , message : SUCCESS_MESSAGES.CREATED})
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
