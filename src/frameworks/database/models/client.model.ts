import mongoose, { Document, model, ObjectId } from "mongoose";
import { IClientEntity } from "../../../entities/models/client.entity";
import { clientSchema } from "../schemas/client.schema";

export interface IClientModel extends Omit<IClientEntity, '_id'>, Document {
  _id: ObjectId;
}

export const ClientModel = model<IClientModel>("Client", clientSchema);