import { injectable } from "tsyringe";
import { IBaseUserRepository } from "../../domain/interfaces/repository/base-user-repository";
import { FilterQuery,Types } from "mongoose";
import { BaseRepository } from "./base-repository.mongo";

@injectable()
export class BaseUserRepository<T> extends BaseRepository<T> implements IBaseUserRepository<T> {

    async saveUser(input: Partial<T>): Promise<T> {
        return await this.create(input)
    }

    async find(filter: FilterQuery<T>, skip: number, limit: number, sort: any): Promise<T[]> {
        return await this.findAll(filter, skip, limit, sort)
    }

    async count(filter: FilterQuery<T>): Promise<number> {
        return await this.model.countDocuments(filter)
    }

    async findByEmail(email: string): Promise<T | null> {
        return await this.findOne({ email });
    }

    async updateOnlineStatus(payload : {userId : Types.ObjectId , isOnline : boolean , lastSeen : string}): Promise<T | null> {
        return await this.update(payload.userId , {
            $set : {
                isOnline : payload.isOnline,
                lastSeen : payload.lastSeen
            }
        });
    }

    async updateLastSeenById(userId: Types.ObjectId, lastSeen: string): Promise<void> {
        
    }

    async findByIdAndUpdatePassword(userId: Types.ObjectId, hashedNewPassword: string): Promise<void> {
    }

    async updateProfileById(userId: Types.ObjectId, data: Partial<T>): Promise<void> {
    }
}