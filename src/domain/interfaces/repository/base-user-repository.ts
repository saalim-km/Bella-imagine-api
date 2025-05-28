import { ObjectId } from "mongoose";

export interface IBaseUserRepository<T> {
  findByEmail(email: string): Promise<T | null>;
  updateOnlineStatus(payload : {userId : ObjectId , isOnline : boolean , lastSeen : string}): Promise<T | null>;
  updateLastSeen(userId: ObjectId, lastSeen: string): Promise<void>;
  findByIdAndUpdatePassword(userId : ObjectId , hashedNewPassword : string) : Promise<void>
  updateProfile(userId : ObjectId , data : Partial<T>) : Promise<void>
}