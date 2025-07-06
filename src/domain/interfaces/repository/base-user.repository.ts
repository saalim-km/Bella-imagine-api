import { FilterQuery, Types } from "mongoose";
import { IClient } from "../../models/client";
import { IVendor } from "../../models/vendor";

export interface IBaseUserRepository<T> {
  saveUser(input : Partial<IClient | IVendor>): Promise<T>
  find(  filter: FilterQuery<T>,
  skip: number,
  limit: number,
  sort: any) : Promise<T[]>
  findByEmail(email: string): Promise<T | null>;
  updateOnlineStatus(payload : {userId : Types.ObjectId , isOnline : boolean , lastSeen : string}): Promise<T | null>;
}