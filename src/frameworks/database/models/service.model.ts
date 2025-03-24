import mongoose, { ObjectId , Document } from "mongoose";
import { IServiceEntity } from "../../../entities/models/service.entity";
import { serviceSchema } from "../schemas/service.schema";

export interface IServiceModel extends Omit<IServiceEntity , "_id"> , Document {
    _id : ObjectId
}

export const serviceModel = mongoose.model("Service",serviceSchema)