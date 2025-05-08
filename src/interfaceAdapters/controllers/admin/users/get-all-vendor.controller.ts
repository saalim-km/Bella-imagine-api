import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IGetAllVendorsController } from "../../../../entities/controllerInterfaces/admin/users/get-all-vendors-controller.intereface";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../../shared/constants";
import { CustomError } from "../../../../entities/utils/custom-error";
import { PaginatedRequestUser } from "../../../../shared/types/admin/admin.type";
import { IPaginationQuery } from "./get-all-clients.controller";
import { IGetAllVendorsUsecase } from "../../../../entities/usecaseInterfaces/admin/users/get-all-vendors-usecase.interafce";

@injectable()
export class GetAllVendorsController implements IGetAllVendorsController {
  constructor(
    @inject("IGetAllVendorsUsecase")
    private getAllVendorUsecase: IGetAllVendorsUsecase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
      console.log(
        "------------------------GetAllVendorsController--------------------"
      );
      console.log(req.query);

      const { page, limit }: IPaginationQuery = req.query;

      const filter: PaginatedRequestUser = {
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
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

      const vendors = await this.getAllVendorUsecase.execute(
        filter,
        page,
        limit
      );
      console.log("got vendors data : ", vendors);
      res.status(HTTP_STATUS.OK).json({ vendors });

  }
}
