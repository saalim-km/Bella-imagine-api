import { inject, injectable } from "tsyringe";
import { ICreateContestController } from "../../../../entities/controllerInterfaces/admin/contest/create-contest-controller.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../../shared/constants";
import { CustomError } from "../../../../entities/utils/custom-error";
import { ICreateContestUsecase } from "../../../../entities/usecaseInterfaces/admin/contest_management/create-contest-usecase.interface";

@injectable()
export class CreateContestController implements ICreateContestController {
    constructor(
        @inject('ICreateContestUsecase') private createContestUsecase : ICreateContestUsecase
    ){}
  async handle(req: Request, res: Response): Promise<void> {
    try {
        await this.createContestUsecase.execute(req.body)
        res.status(HTTP_STATUS.OK).json({success : true , message : SUCCESS_MESSAGES.CREATED})
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.VALIDATION_ERROR,
          errors: error.errors.map((err) => ({ message: err.message })),
        });
        return;
      }
      if (error instanceof CustomError) {
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
        return;
      }
      console.error(error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  }
}
