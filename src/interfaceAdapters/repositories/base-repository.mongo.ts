import { Document, FilterQuery, Model , ObjectId, Types } from "mongoose";
import { IBaseRepository } from "../../domain/interfaces/repository/base-repository";

export class BaseRepository<T> implements IBaseRepository<T> {
    protected model : Model<T>
    constructor(model : Model<T>){
        this.model = model;
    }

    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data)
    }

    async findById(id: ObjectId): Promise<T | null> {
        return await this.model.findById(id)
    }

    async findOne(query: FilterQuery<T>): Promise<T | null> {
        return await this.model.findOne(query)
    }

    findAll(): Promise<T[]> {
        return this.model.find()
    }

    async update(id: ObjectId, data: FilterQuery<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, data, { new: true })
    }

    async delete(id: ObjectId): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id)
        return !!result
    }
}