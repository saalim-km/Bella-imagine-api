import { inject, injectable } from "tsyringe";
import { IUpdateUserStatusController } from "../../../../entities/controllerInterfaces/admin/users/update-user-status-controller.interface";
import { IUpdateUserStatusUsecase } from "../../../../entities/usecaseInterfaces/admin/users/update-user-usecase.interface";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../../shared/constants";
import { Request, Response } from "express";
import { CustomError } from "../../../../entities/utils/custom-error";

@injectable()
export class UpdateUserStatusController implements IUpdateUserStatusController {
  constructor(
    @inject("IUpdateUserStatusUsecase")
    private updateUserStatusUsecase: IUpdateUserStatusUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
      console.log(req.query);
      const {userId , userType} = req.query as {userId : string,userType: string}
      await this.updateUserStatusUsecase.execute(userType, userId)
      res.status(HTTP_STATUS.OK).json({success : true , message : SUCCESS_MESSAGES.UPDATE_SUCCESS})

  }
}
