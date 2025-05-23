import { Document, ObjectId } from "mongoose";

export interface IBaseRepository<T , TDoc extends Document> {
  create(data: Partial<T>): Promise<TDoc>;
  findById(id: ObjectId): Promise<TDoc | null>;
  findAll(): Promise<TDoc[]>;
  update(id: ObjectId, data: Partial<TDoc>): Promise<TDoc | null>;
  delete(id: ObjectId): Promise<boolean>;
}