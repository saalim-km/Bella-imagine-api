// interfaces/client.model.ts
import { Types } from "mongoose";
import { IUserBase } from "./user-base";

export interface IClient extends IUserBase {
  savedPhotographers: Types.ObjectId[];
  savedPhotos: Types.ObjectId[];
}
