import { Request, Response } from "express";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { inject, injectable } from "tsyringe";
import { IGetAllBookingsClientController } from "../../../entities/controllerInterfaces/booking/get-all-bookings-by-client.controller";
import { ZodError } from "zod";
import { CustomError } from "../../../entities/utils/custom-error";
import { IGetAllBookingByClientUseCase } from "../../../entities/usecaseInterfaces/booking/get-all-bookings-by-client-usecase.interface";

@injectable()
export class GetAllBookingByClientController
  implements IGetAllBookingsClientController
{
  constructor(
    @inject("IGetAllBookingByClientUseCase")
    private getAllBookingByClientUseCase: IGetAllBookingByClientUseCase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        sortBy = "newest",
      } = req.query;
      const userId = (req as CustomRequest).user._id;

      const pageNumber = Number(page);
      const pageSize = Number(limit);
      const searchTermString = typeof search === "string" ? search : "";
      const sortByString = typeof sortBy === "string" ? sortBy : "";

      const { bookings, total } =
        await this.getAllBookingByClientUseCase.execute(
          userId,
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
