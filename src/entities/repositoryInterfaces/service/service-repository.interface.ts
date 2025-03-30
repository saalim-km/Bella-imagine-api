import { ObjectId } from "mongoose";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { IServiceFilter } from "../../../shared/types/vendor/service.type";
import { IServiceEntity } from "../../models/service.entity";

export interface IServiceRepository {
    create (serviceData: Partial<IServiceEntity>): Promise<IServiceEntity>;

    // findById?(id: string): Promise<IServiceEntity | null>;

    findAllServiceByVendor (filter : IServiceFilter , skip :  number , limit : number , sort ?: any) : Promise<PaginatedResponse<IServiceEntity>>;

    update (id: string | ObjectId, updateData: Partial<IServiceEntity>): Promise<IServiceEntity | null>;

    // delete?(id: string): Promise<boolean>;

    // findByVendor?(vendorId: string): Promise<IServiceEntity[]>;

    // searchByName?(name: string): Promise<IServiceEntity[]>;

    // getAvailableServices?(date: string): Promise<IServiceEntity[]>;

    // addAvailability?(serviceId: string, availability: IServiceEntity['availableDates'][0]): Promise<IServiceEntity | null>;

    findByServiceName (name : string) : Promise<IServiceEntity | null>
}