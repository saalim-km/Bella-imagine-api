import { inject, injectable } from "tsyringe";
import { IGetClientDetailsController } from "../../../entities/controllerInterfaces/client/get-client-details-controller.interface";
import { Request, Response } from "express";
import { IGetClientDetailsUsecase } from "../../../entities/usecaseInterfaces/client/get-client-details-usecase.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { ZodError } from "zod";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class GetClientDetailsController implements IGetClientDetailsController {
  constructor(
    @inject("IGetClientDetailsUsecase")
    private getClientDetailsUsecase: IGetClientDetailsUsecase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    console.log(
      "---------------------getClientDetial controller--------------------------"
    );
    const user = (req as CustomRequest).user;
    console.log(user);
    const client = await this.getClientDetailsUsecase.execute(user._id);
    console.log(client);

    res.status(HTTP_STATUS.OK).json({ success: true, client });
  }
}
