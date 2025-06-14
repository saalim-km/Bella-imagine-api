import { Types } from "mongoose";

export interface isCatRequestExistsInput {
    vendorId: Types.ObjectId
    categoryId: Types.ObjectId
}