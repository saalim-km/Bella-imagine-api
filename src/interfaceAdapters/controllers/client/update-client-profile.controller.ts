import { Request, Response } from "express";
import { IUpdateClientController } from "../../../entities/controllerInterfaces/client/update-client-profile-controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { inject, injectable } from "tsyringe";
import { IUpdateClientUsecase } from "../../../entities/usecaseIntefaces/client/update-client-profile-usecase.interface";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { ZodError } from "zod";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class UpdateClientController implements IUpdateClientController {
  constructor(
    @inject("IUpdateClientUsecase")
    private updateClientUseCase: IUpdateClientUsecase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      console.log(
        "------------------------in update clinet controller----------------------"
      );
      const { _id } = (req as CustomRequest).user;
      console.log(_id);
      console.log(req.body);

      await this.updateClientUseCase.excute(_id, req.body);

      res
        .status(HTTP_STATUS.OK)
        .json({ success: true, message: SUCCESS_MESSAGES.UPDATE_SUCCESS });
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
