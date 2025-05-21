import { ObjectId } from "mongoose";

export interface IBaseUserRepository<T> {
  findByEmail(email: string): Promise<T | null>;
  updateOnlineStatus(userId: ObjectId, isOnline: boolean, lastSeen?: Date): Promise<T | null>;
  updateLastSeen(userId: ObjectId, lastSeen: string): Promise<void>;
  findByIdAndUpdatePassword(userId : ObjectId , hashedNewPassword : string) : Promise<void>
  updateProfile(userId : ObjectId , data : Partial<T>) : Promise<void>
}