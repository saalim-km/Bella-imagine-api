import { FilterQuery, Model , Types, UpdateQuery } from "mongoose";
import { IBaseRepository } from "../../domain/interfaces/repository/base-repository";
import '../database/schemas/category.schema'
import '../database/schemas/category-request.schema'

export class BaseRepository<T> implements IBaseRepository<T> {
    protected model : Model<T>
    constructor(model : Model<T>){
        this.model = model;
    }

    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data)
    }

    async findById(id: Types.ObjectId , populate : string[] = []): Promise<T | null> {
        const query = this.model.findById(id);
        populate.forEach((path)=> query.populate({path : path}))
        return await query.exec()
    }

    async findOne(query: FilterQuery<T>): Promise<T | null> {
        return await this.model.findOne(query)
    }

    findAll(filter: FilterQuery<T>, skip: number, limit: number, sort: any): Promise<T[]> {
        console.log(filter);
        return this.model.find(filter).skip(skip).limit(limit).sort({createdAt : sort}).exec()
    }

    async update(id: Types.ObjectId, data: UpdateQuery<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, data, { new: true })
    }

    async delete(id: Types.ObjectId): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id)
        return !!result
    }
}