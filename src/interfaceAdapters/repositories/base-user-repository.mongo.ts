import { injectable } from "tsyringe";
import { IBaseUserRepository } from "../../domain/interfaces/repository/base-user-repository";
import { model, Model, ObjectId } from "mongoose";
import { BaseRepository } from "./base-repository.mongo";

@injectable()
export class BaseUserRepository extends BaseRepository<T> implements IBaseUserRepository<T> {
    async findByEmail(email: string): Promise<T | null> {
        return await this._model.findOne({email : email})
    }

    async updateOnlineStatus(userId: any, isOnline: boolean, lastSeen?: Date): Promise<T | null> {
        return await this._model.findByIdAndUpdate(userId, {isOnline, lastSeen}, {new : true})
    }

    async updateLastSeen(userId: ObjectId, lastSeen: string): Promise<void> {
        await this._model.findByIdAndUpdate(userId,{lastSeen : lastSeen})
    }

    async findByIdAndUpdatePassword(userId: ObjectId, hashedNewPassword: string): Promise<void> {
        await this._model.findByIdAndUpdate(userId,{password : hashedNewPassword})
    }

    async updateProfile(userId: ObjectId, data: Partial<T>): Promise<void> {
        await this._model.findByIdAndUpdate()
    }
}