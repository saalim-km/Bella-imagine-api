import { ObjectId } from "mongoose";
import { TRole } from "../../shared/constants/constants";

export interface PaginationQueryDto<T> {
  search?: Partial<T>;
  page?: number;
  limit?: number;
  role?: TRole
}

export interface UserQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  isblocked?: boolean;
  isActive?: boolean;
  createdAt?: number;
  role ?: TRole
};

export interface UserDetailsDto {
  id ?: ObjectId;
  role ?: TRole
}