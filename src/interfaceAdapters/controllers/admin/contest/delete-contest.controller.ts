import { inject, injectable } from "tsyringe";
import { IDeleteContestController } from "../../../../entities/controllerInterfaces/admin/contest/delete-contest-controller.interface";
import { IDeleteContestUsecase } from "../../../../entities/usecaseInterfaces/admin/contest/delete-contest-usecase.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../../shared/constants";
import { CustomError } from "../../../../entities/utils/custom-error";

@injectable()
export class DeleteContestController implements IDeleteContestController {
  constructor(
    @inject("IDeleteContestUsecase")
    private deleteContestUsecase: IDeleteContestUsecase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
        const {contestId} = req.query
        console.log(contestId);
        await this.deleteContestUsecase.execute(contestId as string);
        res.status(HTTP_STATUS.OK).json({success : true , message : SUCCESS_MESSAGES.DELETE_SUCCESS})
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
