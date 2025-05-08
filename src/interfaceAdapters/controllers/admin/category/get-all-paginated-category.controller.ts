import { Request, Response } from "express";
import { IGetAllPaginatedCategoryController } from "../../../../entities/controllerInterfaces/admin/category/get-all-paginated-category-controller.interfaec";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../../shared/constants";
import { CustomError } from "../../../../entities/utils/custom-error";
import { inject, injectable } from "tsyringe";
import { IGetAllPaginatedCategoryUseCase } from "../../../../entities/usecaseInterfaces/admin/category/get-all-paginated-category-usecase.interface";

@injectable()
export class GetAllPaginatedCategoryController
  implements IGetAllPaginatedCategoryController
{
  constructor(
    @inject("IGetAllPaginatedCategoryUseCase")
    private getAllPaginatedCategoryUseCase: IGetAllPaginatedCategoryUseCase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
      const { limit, page, search, status } = req.query;

      const parsedPage = page ? parseInt(page as string, 10) : 1;
      const parsedLimit = limit ? parseInt(limit as string, 10) : 10;

      const filter = {
        search: search as string,
        status: status ? status === "active" : undefined,
      };

      const { categories, total, all } =
        await this.getAllPaginatedCategoryUseCase.execute(
          filter,
          parsedPage,
          parsedLimit
        );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        categories,
        totalPages: Math.ceil(total / parsedLimit),
        currentPage: parsedPage,
        totalCategory: all,
      });

  }
}
