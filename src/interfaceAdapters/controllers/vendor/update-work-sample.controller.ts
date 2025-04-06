import { inject, injectable } from "tsyringe";
import { IUpdateWorkSampleController } from "../../../entities/controllerInterfaces/vendor/update-work-sample-controller.interface";
import { IUpdateWorkSampleUsecase } from "../../../entities/usecaseInterfaces/vendor/update-work-sample-usecase.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IWorkSampleUpdateRequest } from "../../../shared/types/vendor/work-sample.types";
import { IWorkSampleEntity } from "../../../entities/models/work-sample.entity";

@injectable()
export class UpdateWorkSampleController implements IUpdateWorkSampleController {
  constructor(
    @inject("IUpdateWorkSampleUsecase")
    private updateWorkSampleUsecase: IUpdateWorkSampleUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
        console.log('ing updateworksmaple controller', req.body);
        const {_id,...worksampleData} = req.body.data as Partial<IWorkSampleEntity>;
        console.log(_id,worksampleData);
        await this.updateWorkSampleUsecase.execute(_id as string,worksampleData)
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
