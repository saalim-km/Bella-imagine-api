import { FilterQuery, Types } from "mongoose";

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: Types.ObjectId): Promise<T | null>;
  findOne(query: FilterQuery<T>): Promise<T | null>;
  findAll(filter: FilterQuery<T>, skip: number, limit: number, sort: number): Promise<T[]>;
  update(id: Types.ObjectId, data: FilterQuery<T>): Promise<T | null>;
  delete(id: Types.ObjectId): Promise<boolean>;
}