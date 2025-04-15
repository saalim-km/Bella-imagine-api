import { inject, injectable } from "tsyringe";
import { IParticipateContestController } from "../../../entities/controllerInterfaces/contest/participate-contest-controller.interface";
import { IParticipateContestUsecase } from "../../../entities/usecaseInterfaces/contest/participate-contest-usecase.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class ParticipateContestController
  implements IParticipateContestController
{
  constructor(
    @inject("IParticipateContestUsecase")
    private participateContestUseCase: IParticipateContestUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      await this.participateContestUseCase.execute(req.body)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Contest participated successfully",
      });
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
