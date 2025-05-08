import { Request, Response } from "express";
import { IGetAllBookingForVendorController } from "../../../entities/controllerInterfaces/booking/get-all-booking-for-vendor-controller.interface";
import { IGetAllBookingForVendorUseCase } from "../../../entities/usecaseInterfaces/booking/get-all-booking-for-vendor-usecase.interface";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { inject, injectable } from "tsyringe";
import { ZodError } from "zod";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class  GetAllBookingForVendorController
  implements IGetAllBookingForVendorController
{
  constructor(
    @inject("IGetAllBookingForVendorUseCase")
    private getAllBookingForVendorUseCase: IGetAllBookingForVendorUseCase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
      const {
        page = 1,
        limit = 10,
        search = "",
        sortBy = "newest",
      } = req.query;
      const clientId = (req as CustomRequest).user._id;

      const pageNumber = Number(page);
      const pageSize = Number(limit);
      const searchTermString = typeof search === "string" ? search : "";
      const sortByString = typeof sortBy === "string" ? sortBy : "";

      const { bookings, total } =
        await this.getAllBookingForVendorUseCase.execute(
          clientId,
          pageNumber,
          pageSize,
          searchTermString,
          sortByString
        );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        bookings,
        totalPages: total,
        currentPage: pageNumber,
      });

  }
}
