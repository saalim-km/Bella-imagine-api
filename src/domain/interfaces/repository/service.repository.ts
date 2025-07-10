import { FilterQuery, Types } from "mongoose";
import { IBooking } from "../../models/booking";
import { IService } from "../../models/service";
import { IBaseRepository } from "./base.repository";
import { PaginatedResponse } from "../usecase/types/common.types";

export interface IServiceRepository extends IBaseRepository<IService> {
  updateSlotCount(booking: IBooking, count: number): Promise<void>;
  getServices(
    filter: FilterQuery<IService>,
    skip: number,
    limit: number,
    sort: number
  ): Promise<PaginatedResponse<IService>>;
}
