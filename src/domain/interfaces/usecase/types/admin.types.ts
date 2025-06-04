import { FilterQuery , Types } from "mongoose";
import { TRole } from "../../../../shared/constants/constants";
import { IUser } from "../../../models/user-base";

export interface UsersFilterInput {
  search?: string;
  page: number;
  limit: number;
  isblocked?: boolean;
  createdAt?: number;
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
