import { FilterQuery , Types } from "mongoose";
import { TRole } from "../../../../shared/constants/constants";
import { IUser } from "../../../models/user-base";

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

export interface VendorRequestFilterInput
  extends Pick<UsersFilterInput, "createdAt" | "limit" | "page" | "search"> {}

export interface updateUserStatusInput extends UserDetailsInput {
  isblocked : boolean
}

export interface updateVendorRequestInput {
  id:  Types.ObjectId;
  status : boolean;
  reason ?: string;
}

export interface getCategoriesFilterInput extends Omit<PaginationInput,'createdAt'> {
  status : boolean
}