import { FilterQuery, Types } from "mongoose";

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id:Types.ObjectId , populate ?: string[]): Promise<T | null>;
  findOne(query: FilterQuery<T>): Promise<T | null>;
  findAll(filter: FilterQuery<T>, skip: number, limit: number, sort: any): Promise<T[]>;
  count(filter: FilterQuery<T>): Promise<number>
  update(id:Types.ObjectId, data: FilterQuery<T>): Promise<T | null>;
  delete(id:Types.ObjectId): Promise<boolean>;
}