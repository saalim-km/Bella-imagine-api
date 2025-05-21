import { ObjectId } from "mongoose";

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  find(id: ObjectId): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: ObjectId, data: Partial<T>): Promise<T | null>;
  delete(id: ObjectId): Promise<boolean>;
}