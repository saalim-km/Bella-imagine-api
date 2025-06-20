import { Types } from "mongoose";

export type TVendorRequestStatus = 'pending' | 'approved' | 'rejected';
export interface ICategoryRequest {
  _id: Types.ObjectId;
  vendorId: Types.ObjectId;
  categoryId: Types.ObjectId;
  status: TVendorRequestStatus
  createdAt?: Date;
  updatedAt?: Date;
}