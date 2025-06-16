import { IBooking } from "../../models/booking";
import { IService } from "../../models/service";
import { IBaseRepository } from "./base.repository";

export interface IServiceRepository extends IBaseRepository<IService> {
    updateSlotCount(booking : IBooking , count : number): Promise<void>;
}