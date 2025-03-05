import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/client-repository.interface";
import { IClientEntity } from "../../../entities/models/client.entity";
import { ClientModel } from "../../../frameworks/database/models/client.model";

@injectable()
export class ClientRepository implements IClientRepository {
    async save(data: IClientEntity): Promise<IClientEntity> {
        return ClientModel.create(data);
    }

    async find(filter: Record<string, any>, skip: number, limit: number): Promise<{ user: IClientEntity[] | []; total: number; }> {
        const [user, total] = await  Promise.all([
            ClientModel.find(filter).sort({createdAt : -1}).skip(skip).limit(limit),
            ClientModel.countDocuments(filter),
        ]);

        return {
            user,
            total
        }
    }

    async findById(id: string): Promise<IClientRepository | null> {
        return ClientModel.findById(id);
    }

    async findByEmail(email: string): Promise<IClientRepository | null> {
        return ClientModel.findOne({email : email})
    }

    async findByIdAndUpdatePassword(id: string, password: string): Promise<void> {
        await ClientModel.findByIdAndUpdate(id,{password : password})
    }

    async updateClientProfileById(id: string, data: Partial<IClientEntity>): Promise<void> {
        await ClientModel.findByIdAndUpdate(id,{$set : data})
    }
}