import { inject, injectable } from "tsyringe";
import {Request , Response} from 'express'
import { IGetAllVendorsUsecase } from "../../../entities/usecaseIntefaces/admin/get-all-vendors-usecase.interafce";
import { IGetAllVendorsController } from "../../../entities/controllerInterfaces/admin/get-all-vendors-controller.intereface";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { PaginatedRequest } from "../../../shared/types/admin/admin.type";
import { json } from "stream/consumers";

@injectable()
export class GetAllVendorsController implements IGetAllVendorsController {
    constructor(
        @inject("IGetAllVendorsUsecase") private getAllVendorUsecase : IGetAllVendorsUsecase
    ){}
    async handle(req:Request, res:Response): Promise<void> {
        try {
            console.log('------------------------GetAllVendorsController--------------------');
            console.log(req.query);
            const {search , page , limit} = req.query as PaginatedRequest;
            const vendors = await this.getAllVendorUsecase.execute(search,page,limit)
            console.log('got vendors data : ',vendors);

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