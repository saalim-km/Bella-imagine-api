import { inject, injectable } from "tsyringe";
import { IDeleteWorkSampleController } from "../../../entities/controllerInterfaces/vendor/delete-work-sample-controller.interface";
import { IDeleteWorkSampleUsecase } from "../../../entities/usecaseInterfaces/vendor/delete-work-sample-usecase.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class DeleteWorkSampleController implements IDeleteWorkSampleController {
  constructor(
    @inject("IDeleteWorkSampleUsecase")
    private deleteWorkSampleUsecase: IDeleteWorkSampleUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
        const {id} = req.query
        await this.deleteWorkSampleUsecase.execute(id as string)
        res.status(HTTP_STATUS.OK).json({success : true , message : SUCCESS_MESSAGES.DELETE_SUCCESS})
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
