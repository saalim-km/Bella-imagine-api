import { FilterQuery , Types } from "mongoose";
import { TRole } from "../../../../shared/constants/constants";
import { IUser } from "../../../models/user-base";
import { TCategoryRequestStatus } from "../../../../shared/types/category.types";

export interface PaginationInput {
  page: number;
  limit: number;
  search?: string;
  createdAt?: number;
}
export interface UsersFilterInput extends PaginationInput {
  isblocked?: boolean;
  role: TRole;
}

export interface UserStrategyFilterInput extends Omit<UsersFilterInput , 'search'> {
  search ?: FilterQuery<IUser>
}
export interface UserDetailsInput {
  id: Types.ObjectId;
  role: TRole;
}

export type VendorRequestFilterInput
  = Pick<UsersFilterInput, "createdAt" | "limit" | "page" | "search"> 

export interface UpdateUserStatusInput extends UserDetailsInput {
  isblocked : boolean
}

export interface UpdateVendorRequestInput {
  id:  Types.ObjectId;
  status : boolean;
  reason ?: string;
}

export interface GetCategoriesFilterInput extends Omit<PaginationInput,'createdAt'> {
  status ?: boolean
}

export interface CreateNewCategoryInput {
  title : string;
  status : boolean
}

export type getCatJoinRequestInput = Pick<PaginationInput , 'limit' | 'page' > 

export interface UpdateCategory {
  id : Types.ObjectId,
  data : {
    title : string;
    status : boolean
  }
}

export interface UupdateCatReqInput {
  categoryId : Types.ObjectId,
  status : TCategoryRequestStatus,
  vendorId : Types.ObjectId
}