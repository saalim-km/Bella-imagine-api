import { Document, Model , ObjectId, Types } from "mongoose";
import { IBaseRepository } from "../../domain/interfaces/repository/base-repository";

export class BaseRepository<T , TDoc extends Document> implements IBaseRepository<T , TDoc> {
    private model : Model<TDoc>
    constructor(model : Model<TDoc>){
        this.model = model;
    }

    async create(data: Partial<T>): Promise<TDoc> {
        return await this.model.create(data)
    }

    findAll(): Promise<TDoc[]> {
        return this.model.find()
    }

    async findById(id: ObjectId): Promise<TDoc | null> {
        return await this.model.findById(id)
    }

    async update(id: ObjectId, data: Partial<TDoc>): Promise<TDoc | null> {
        return await this.model.findByIdAndUpdate(id,data,{new : true});    
    }

    async delete(id: ObjectId): Promise<boolean> {
        const res = await this.model.findByIdAndDelete(id)
        return !!res
    }
}