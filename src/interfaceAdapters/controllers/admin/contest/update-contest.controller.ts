import { inject, injectable } from "tsyringe";
import { IUpdateContestController } from "../../../../entities/controllerInterfaces/admin/contest/update-contest-controller.interface";
import { IUpdateContestUsecase } from "../../../../entities/usecaseInterfaces/admin/contest_management/update-contest-usecase.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../../shared/constants";
import { CustomError } from "../../../../entities/utils/custom-error";
import { UpdateContestDto } from "../../../../shared/types/contest/contest.types";

@injectable()
export class UpdateContestController implements IUpdateContestController {
  constructor(
    @inject("IUpdateContestUsecase")
    private updateContestUsecase: IUpdateContestUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
        const {contestId , data} : UpdateContestDto = req.body as UpdateContestDto;
        console.log('got data : ',contestId , data);
        await this.updateContestUsecase.execute(contestId,data);
        res.status(HTTP_STATUS.OK).json({success : true , message : SUCCESS_MESSAGES.UPDATE_SUCCESS});
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
