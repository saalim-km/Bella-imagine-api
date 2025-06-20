import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IService } from "../../domain/models/service";
import { IServiceRepository } from "../../domain/interfaces/repository/service.repository";
import { Service } from "../database/schemas/service.schema";
import { IBooking } from "../../domain/models/booking";
import { FilterQuery } from "mongoose";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";

@injectable()
export class ServiceRepository extends BaseRepository<IService> implements IServiceRepository {
    constructor(){
        super(Service)
    }

    async updateSlotCount(booking: IBooking , count : number): Promise<void> {
        const {_id , bookingDate , timeSlot , serviceDetails } = booking;
        await this.model.updateOne({_id : serviceDetails._id},
            {
                $inc: {
                    "availableDates.$[dateElem].timeSlots.$[slotElem].capacity": count
                }
            },
            {
                arrayFilters : [
                    {'dateElem.date' : bookingDate},
                    {'slotElem.startTime' : timeSlot.startTime, 'slotElem.endTime' : timeSlot.endTime}
                ]
            }
        )
    }

    async getServices(filter: FilterQuery<IService>, skip: number, limit: number, sort: any = -1) : Promise<PaginatedResponse<IService>> {
        const [services,count] = await Promise.all([
            this.model.find(filter).populate({path : 'category' , select : 'title'}).skip(skip).limit(limit).sort({createdAt : sort}),
            this.model.countDocuments(filter)
        ]) 

        return {
            data  :services,
            total : count
        }
    }
}