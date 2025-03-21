import mongoose, { ObjectId } from "mongoose";
import { IWorkSampleEntity } from "../../../entities/models/work-sample.entity";
import { workSampleSchema } from "../schemas/work-sample.schema";

export interface IWorkSampleModel extends Omit<IWorkSampleEntity,"_id">, Document {
    _id : ObjectId
}

export const workSampleModel = mongoose.model('WorkSample',workSampleSchema)