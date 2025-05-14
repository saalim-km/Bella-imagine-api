import { inject, injectable } from "tsyringe";
import { IGetPhotographerDetailsController } from "../../../entities/controllerInterfaces/client/get-photographer-details-controller.interface";
import { IGetPhotographerDetailsUsecase } from "../../../entities/usecaseInterfaces/client/get-photographer-details-usecase.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class GetPhotographerDetailsController
  implements IGetPhotographerDetailsController
{
  constructor(
    @inject("IGetPhotographerDetailsUsecase")
    private getPhotographerDetailsUsecase: IGetPhotographerDetailsUsecase
  ) {}

async handle(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const {
    servicePage = "1",
    serviceLimit = "3",
    samplePage = "1",
    sampleLimit = "3"
  } = req.query;

  const vendor = await this.getPhotographerDetailsUsecase.execute(
    id,
    Number(servicePage),
    Number(serviceLimit),
    Number(samplePage),
    Number(sampleLimit)
  );

  res.status(HTTP_STATUS.OK).json(vendor);
}
}
