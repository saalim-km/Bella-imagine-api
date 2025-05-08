import { inject, injectable } from "tsyringe";
import { IGetUserDetailsController } from "../../../../entities/controllerInterfaces/admin/users/get-user-details-controller.interface";
import { Request, Response } from "express";
import { ERROR_MESSAGES, HTTP_STATUS, TRole } from "../../../../shared/constants";
import { ZodError } from "zod";
import { CustomError } from "../../../../entities/utils/custom-error";
import { IUserDetailsRequest } from "../../../../shared/types/admin/admin.type";
import { IGetUserDetailsUsecase } from "../../../../entities/usecaseInterfaces/admin/users/get-user-details-usecase.interface";

@injectable()
export class GetUserDetailsController implements IGetUserDetailsController {
  constructor(
    @inject("IGetUserDetailsUsecase") private getUserDetailsUsecase: IGetUserDetailsUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
      const {id,role} = req.query as unknown as IUserDetailsRequest;
      const user = await this.getUserDetailsUsecase.execute(id, role);
      res.status(HTTP_STATUS.OK).json({success : true , user})

  }
}
