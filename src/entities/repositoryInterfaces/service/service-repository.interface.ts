import { ObjectId } from "mongoose";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { IServiceFilter } from "../../../shared/types/vendor/service.type";
import { IServiceEntity } from "../../models/service.entity";

export interface IServiceRepository {
  create(serviceData: Partial<IServiceEntity>): Promise<IServiceEntity>;

  findById(id: string): Promise<IServiceEntity | null>;

  findAllServiceByVendor(
    filter: IServiceFilter,
    skip: number,
    limit: number,
    sort?: any
  ): Promise<PaginatedResponse<IServiceEntity>>;

  update(
    id: string | ObjectId,
    updateData: Partial<IServiceEntity>
  ): Promise<IServiceEntity | null>;

  serviceExists(name: string , vendorId : string): Promise<IServiceEntity | null>;

  saveCount(
    serviceId: string | ObjectId,
    dateString: string,
    startTime: string,
    endTime: string
  ): Promise<void>;

  addslot(serviceId: string | ObjectId,
    dateString: string,
    startTime: string,
    endTime: string
  ): Promise<void>;
}
