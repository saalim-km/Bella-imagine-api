import { inject, injectable } from "tsyringe";
import { IGetPaginatedContestController } from "../../../../entities/controllerInterfaces/admin/contest/get-all-paginated-contest-controller.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../../shared/constants";
import { CustomError } from "../../../../entities/utils/custom-error";
import { PaginatedRequestContest, TContestStatus } from "../../../../shared/types/contest/contest.types";
import { IGetPaginatedContestUsecase } from "../../../../entities/usecaseInterfaces/admin/contest/get-paginated-contest-usecase.interface";

@injectable()
export class GetPaginatedContestController
  implements IGetPaginatedContestController
{
  constructor(
    @inject('IGetPaginatedContestUsecase') private getPaginatedContestUsecase : IGetPaginatedContestUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
        console.log(req.query);
        const data = await this.getPaginatedContestUsecase.execute(req.query as PaginatedRequestContest)
        res.status(HTTP_STATUS.OK).json(data)
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
