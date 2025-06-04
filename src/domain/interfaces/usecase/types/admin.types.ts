import { ObjectId } from "mongoose";
import { UserQueryParams } from "../../../../presentation/dto/admin.dto";
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
    id : ObjectId;
    role : TRole
}