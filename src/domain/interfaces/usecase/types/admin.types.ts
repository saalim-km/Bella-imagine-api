import { Types } from "mongoose";
import { TRole } from "../../../../shared/constants/constants";

export interface UsersFilterInput {
  search?: string;
  page: number;
  limit: number;
  isblocked?: boolean;
  createdAt?: number;
  role : TRole
}

export interface UserDetailsInput {
    id : Types.ObjectId;
    role : TRole
}