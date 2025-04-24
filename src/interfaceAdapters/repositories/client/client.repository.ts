import { injectable } from "tsyringe";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/client-repository.interface";
import { IClientEntity } from "../../../entities/models/client.entity";
import {
  ClientModel,
  IClientModel,
} from "../../../frameworks/database/models/client.model";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { ObjectId } from "mongoose";

@injectable()
export class ClientRepository implements IClientRepository {
  async save(data: IClientEntity): Promise<IClientEntity> {
    return await ClientModel.create(data);
  }

  async find(
    filter: Record<string, any>,
    skip: number,
    limit: number,
    sort: any
  ): Promise<PaginatedResponse<IClientEntity>> {
    const [user, total] = await Promise.all([
      ClientModel.find(filter)
        .sort({ createdAt: sort })
        .skip(skip)
        .limit(limit),
      ClientModel.countDocuments(filter),
    ]);

    return {
      data: user,
      total,
    };
  }

  async findById(id: string): Promise<IClientEntity | null> {
    return await ClientModel.findById(id);
  }

  async findByEmail(email: string): Promise<IClientEntity | null> {
    return await ClientModel.findOne({ email: email });
  }

  async findByIdAndUpdatePassword(id: string, password: string): Promise<void> {
    await ClientModel.findByIdAndUpdate(id, { password: password });
  }

  async updateClientProfileById(
    id: string | ObjectId,
    data: Partial<IClientEntity>
  ): Promise<any> {
    return await ClientModel.findByIdAndUpdate(id, data, { new: true });
  }

  async updateOnlineStatus(
    id: string,
    isOnline: boolean,
    lastSeen?: Date
  ): Promise<any> {
    return await ClientModel.findByIdAndUpdate(
      id,
      { isOnline, lastSeen },
      { new: true }
    );
  }

  async findByIds(vendorIds: string[]): Promise<IClientModel[]> {
    return await ClientModel.find({
      _id: { $in: vendorIds },
    }).exec();
  }


  async findByIdAndUpdateOnlineStatus(clientId: string, status: "offline" | "online"): Promise<IClientEntity | null> {
    return await ClientModel.findByIdAndUpdate(clientId , {$set : {onlineStatus : status}})
  }
}
