import { ObjectId } from "mongoose";
import { IClient } from "../../models/client";
import { IVendor } from "../../models/vendor";

export interface IBaseUserRepository<T> {
  saveUser(input : Partial<IClient | IVendor>): Promise<T>
  find(  filter: any,
  skip: number,
  limit: number,
  sort: any) : Promise<T[]>
  count(filter : any) : Promise<number>
  findByEmail(email: string): Promise<T | null>;
  updateOnlineStatus(payload : {userId : ObjectId , isOnline : boolean , lastSeen : string}): Promise<T | null>;
  updateLastSeenById(userId: ObjectId, lastSeen: string): Promise<void>;
  findByIdAndUpdatePassword(userId : ObjectId , hashedNewPassword : string) : Promise<void>
  updateProfileById(userId : ObjectId , data : Partial<T>) : Promise<void>
}