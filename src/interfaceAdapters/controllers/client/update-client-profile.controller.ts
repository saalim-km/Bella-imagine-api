import { Request, Response } from "express";
import { IUpdateClientController } from "../../../entities/controllerInterfaces/client/update-client-profile-controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { inject, injectable } from "tsyringe";
import { IUpdateClientUsecase } from "../../../entities/usecaseInterfaces/client/update-client-profile-usecase.interface";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { ZodError } from "zod";
import { CustomError } from "../../../entities/utils/custom-error";
import { IAwsS3Service } from "../../../entities/services/awsS3-service.interface";
import path from "path";
import { unlinkSync } from "fs";

@injectable()
export class UpdateClientController implements IUpdateClientController {
  constructor(
    @inject("IUpdateClientUsecase")
    private updateClientUseCase: IUpdateClientUsecase,
    @inject("IAwsS3Service") private awsS3Service: IAwsS3Service
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    const { _id } = (req as CustomRequest).user;
    const updateData = { ...req.body };

    await this.updateClientUseCase.excute(_id, updateData, req.file);

    if (req.file) {
      unlinkSync(req.file.path);
    }

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.UPDATE_SUCCESS });
  }
}
