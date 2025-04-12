import { inject, injectable } from "tsyringe";
import { IGetAllClientController } from "../../../../entities/controllerInterfaces/admin/users/get-all-clients-controller.interface";
import { Request, Response } from "express";
import { IGetAllClientUsecase } from "../../../../entities/usecaseInterfaces/admin/users/get-all-clients-usecase.interafce";
import { IClientEntity } from "../../../../entities/models/client.entity";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../../shared/constants";
import { ZodError } from "zod";
import { CustomError } from "../../../../entities/utils/custom-error";
import { PaginatedRequestUser } from "../../../../shared/types/admin/admin.type";

export interface IPaginationQuery {
  search?: Partial<IClientEntity>;
  page?: number;
  limit?: number;
}

@injectable()
export class GetAllClientsController implements IGetAllClientController {
  constructor(
    @inject("IGetAllClientUsecase")
    private getAllClientUsecase: IGetAllClientUsecase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      console.log(
        "---------------------inGetAllClientsController---------------------"
      );
      console.log(req.query);
      const { page, limit }: IPaginationQuery = req.query;

      const filter: PaginatedRequestUser = {
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        isblocked: req.query.isblocked ? req.query.isblocked === 'true' : undefined,
        isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
        createdAt: req.query.createdAt ? parseInt(req.query.createdAt as string) : undefined
      };
      const clients = await this.getAllClientUsecase.execute(
        filter,
        page,
        limit
      );

      res.status(HTTP_STATUS.OK).json({
        clients,
      });
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
