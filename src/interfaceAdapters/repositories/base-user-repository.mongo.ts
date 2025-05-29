import { injectable } from "tsyringe";
import { IBaseUserRepository } from "../../domain/interfaces/repository/base-user-repository";
import { model, Model, ObjectId } from "mongoose";
import { BaseRepository } from "./base-repository.mongo";
import { IClient } from "../../domain/models/client";
import { IVendor } from "../../domain/models/vendor";

@injectable()
export class BaseUserRepository<T> extends BaseRepository<T> implements IBaseUserRepository<T> {

    async saveUser(input: Partial<T>): Promise<void> {
        await this.create(input)
    }

    async findByEmail(email: string): Promise<T | null> {
        return await this.findOne({ email });
    }

    async updateOnlineStatus(payload : {userId : ObjectId , isOnline : boolean , lastSeen : string}): Promise<T | null> {
        return await this.update(payload.userId , {
            $set : {
                isOnline : payload.isOnline,
                lastSeen : payload.lastSeen
            }
        });
    }

    async updateLastSeen(userId: ObjectId, lastSeen: string): Promise<void> {
        
    }

    async findByIdAndUpdatePassword(userId: ObjectId, hashedNewPassword: string): Promise<void> {
    }

    async updateProfile(userId: ObjectId, data: Partial<T>): Promise<void> {
    }
}