import { inject, injectable } from "tsyringe";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IGetAllPaginatedWorkSampleController } from "../../../entities/controllerInterfaces/vendor/get-paginated-work-sample-controller.interface";
import { IGetPaginatedWorkSampleUsecase } from "../../../entities/usecaseInterfaces/vendor/get-paginated-work-sample-usecase.interface";
import { IWorkSampleFilter } from "../../../shared/types/vendor/work-sample.types";

@injectable()
export class GetAllPaginatedWorkSampleController implements IGetAllPaginatedWorkSampleController {
  constructor(
    @inject("IGetPaginatedWorkSampleUsecase")
    private getAllPaginatedWorkSamplesUsecase: IGetPaginatedWorkSampleUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
        // console.log('in GetAllPaginatedWorkSampleController');
        // console.log(req.query);
        const user = (req as CustomRequest).user;
        const { 
          title, 
          service, 
          tags, 
          isPublished, 
          page = 1, 
          limit = 4 
        } = req.query;
  
        const filters: IWorkSampleFilter = {
          ...(title && { title: title as string }),
          ...(service && { service: service as string }),
          ...(tags && { tags: tags as string[]}),
          ...(isPublished !== undefined && { isPublished: isPublished === 'true' }),
        };
  
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
  
        const data = await this.getAllPaginatedWorkSamplesUsecase.execute(
          filters, 
          limitNum, 
          pageNum, 
          user._id
        );
  
        res.status(HTTP_STATUS.OK).json(data);
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