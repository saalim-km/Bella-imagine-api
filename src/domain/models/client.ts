// interfaces/client.model.ts
import { ObjectId } from "mongoose";
import { IUserBase } from "./user-base";

export interface IClient extends IUserBase {
  savedPhotographers: ObjectId[];
  savedPhotos: ObjectId[];
}
