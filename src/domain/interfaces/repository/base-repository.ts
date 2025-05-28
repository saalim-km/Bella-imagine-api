import { FilterQuery, ObjectId } from "mongoose";

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: ObjectId): Promise<T | null>;
  findOne(query: FilterQuery<T>): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: ObjectId, data: FilterQuery<T>): Promise<T | null>;
  delete(id: ObjectId): Promise<boolean>;
}