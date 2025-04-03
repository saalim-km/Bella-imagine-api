import { inject, injectable } from "tsyringe";
import { IGetAllPaginatedServicesController } from "../../../entities/controllerInterfaces/vendor/get-paginated-service-controller.interface";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { Request, Response } from "express";
import { IGetAllPaginatedServicesUsecase } from "../../../entities/usecaseInterfaces/vendor/get-all-paginated-services-usecase.interface";
import { IServiceFilter } from "../../../shared/types/vendor/service.type";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class GetAllPaginatedServicesController implements IGetAllPaginatedServicesController {
  constructor(
    @inject("IGetAllPaginatedServicesUsecase")
    private getAllPaginatedServicesUsecase: IGetAllPaginatedServicesUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
        // console.log('in GetAllPaginatedServicesController');
        // console.log(req.query);
        const user = (req as CustomRequest).user;
      const { serviceTitle, category, location, page = 1, limit = 4 } = req.query;

      const filters: IServiceFilter = {
        ...(serviceTitle && { serviceTitle: serviceTitle as string }),
        ...(category && { category: category as string }),
        ...(location && { location: location as string }),
      };
      console.log(filters);
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);

      const result = await this.getAllPaginatedServicesUsecase.execute(filters, limitNum, pageNum,user._id);

      console.log(result);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
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