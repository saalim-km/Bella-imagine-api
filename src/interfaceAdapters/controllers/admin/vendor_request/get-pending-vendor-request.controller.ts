import { inject, injectable } from "tsyringe";
import { IGetPendingVendorRequestController } from "../../../../entities/controllerInterfaces/admin/vendor_request/get-pending-vendor-request-controller.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../../shared/constants";
import { CustomError } from "../../../../entities/utils/custom-error";
import { PaginatedRequestUser } from "../../../../shared/types/admin/admin.type";
import { IGetPendingVendorRequestUsecase } from "../../../../entities/usecaseInterfaces/admin/vendor_request/get-pending-vendor-request-usecase.interface";

@injectable()
export class GetPendingVendorController
  implements IGetPendingVendorRequestController
{
  constructor(
    @inject("IGetPendingVendorRequestUsecase")
    private getPendingVendorUsecase: IGetPendingVendorRequestUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
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

  }
}
