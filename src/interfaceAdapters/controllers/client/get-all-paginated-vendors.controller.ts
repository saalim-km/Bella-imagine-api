import { Request, Response } from "express";
import { IGetAllPaginatedVendorsController } from "../../../entities/controllerInterfaces/client/get-all-paginated-vendors-interface.controller";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { inject, injectable } from "tsyringe";
import { IGetAllPaginatedVendorsUsecase } from "../../../entities/usecaseInterfaces/client/get-all-paginated-vendors-usecase-interface";
import { IVendorsFilter } from "../../../shared/types/client/vendors-list.type";

@injectable()
export class GetAllPaginatedVendorsController
  implements IGetAllPaginatedVendorsController
{
    constructor(
        @inject("IGetAllPaginatedVendorsUsecase") private getPaginatedVendorsUseacse : IGetAllPaginatedVendorsUsecase
    ){}
  async handle(req: Request, res: Response): Promise<void> {
    try {
        console.log('in GetAllPaginatedVendorsController');
        console.log(req.query);
        const data = await (await this.getPaginatedVendorsUseacse.execute(req.query as IVendorsFilter))
        console.log('vendors kitti : ',data);
        res.status(HTTP_STATUS.OK).json(data)
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
