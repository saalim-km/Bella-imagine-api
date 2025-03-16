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
    try {
      console.log(
        "---------------------getClientDetial controller--------------------------"
      );
      const user = (req as CustomRequest).user;
      console.log(user);
      const client = await this.getClientDetailsUsecase.execute(user._id);
      console.log(client);

      res.status(HTTP_STATUS.OK).json({ success: true, client });
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
