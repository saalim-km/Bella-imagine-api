import { injectable } from "tsyringe";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/client-repository.interface";
import { IClientEntity } from "../../../entities/models/client.entity";
import { ClientModel } from "../../../frameworks/database/models/client.model";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";

@injectable()
export class ClientRepository implements IClientRepository {
    async save(data: IClientEntity): Promise<IClientEntity> {
        return await ClientModel.create(data);
    }

    async find(filter: Record<string, any>, skip: number, limit: number): Promise<PaginatedResponse<IClientEntity>> {
        const [user, total] = await  Promise.all([
            ClientModel.find(filter).sort({createdAt : -1}).skip(skip).limit(limit),
            ClientModel.countDocuments(filter),
        ]);

        return {
            data : user,
            total
        }
    }

    async findById(id: string): Promise<IClientEntity | null> {
        return await ClientModel.findById(id);
    }

    async findByEmail(email: string): Promise<IClientEntity | null> {
        return await ClientModel.findOne({email : email})
    }

    async findByIdAndUpdatePassword(id: string, password: string): Promise<void> {
        await ClientModel.findByIdAndUpdate(id,{password : password})
    }

    async updateClientProfileById(id: string, data: Partial<IClientEntity>): Promise<void> {
        await ClientModel.findByIdAndUpdate(id,{$set : data})
    }
}