import { inject, injectable } from "tsyringe";
import { IGetPendingVendorRequestController } from "../../../entities/controllerInterfaces/admin/get-pending-vendor-request-controller.interface";
import { IGetPendingVendorRequestUsecase } from "../../../entities/usecaseInterfaces/admin/get-pending-vendor-request-usecase.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { PaginatedRequestUser } from "../../../shared/types/admin/admin.type";

@injectable()
export class GetPendingVendorController
  implements IGetPendingVendorRequestController
{
  constructor(
    @inject("IGetPendingVendorRequestUsecase")
    private getPendingVendorUsecase: IGetPendingVendorRequestUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const filter: PaginatedRequestUser = {
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 4,
        isblocked: req.query.isblocked
          ? req.query.isblocked === "true"
          : undefined,
        isActive: req.query.isActive
          ? req.query.isActive === "true"
          : undefined,
        createdAt: req.query.createdAt
          ? parseInt(req.query.createdAt as string)
          : undefined,
      };
      const vendors = await this.getPendingVendorUsecase.execute(filter, filter.page, filter.limit);
      res.status(HTTP_STATUS.OK).json({vendors})
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
