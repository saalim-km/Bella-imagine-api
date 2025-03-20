import { TRole } from "../../constants";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface PaginatedRequestUser {
  search?: string;
  page: number;
  limit: number;
  isblocked ?: boolean;
  isActive ?: boolean;
  createdAt ?: number;
}


export interface UpdateBlockStatusRequest {
    userType : TRole,
    userId : string
}


export interface PaginatedRequestCategory {
  search ?: string,
  status ?: boolean,
}