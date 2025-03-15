import { TRole } from "../../constants";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface PaginatedRequest {
  search?: string;
  page?: number;
  limit?: number;
}


export interface UpdateBlockStatusRequest {
    userType : TRole,
    userId : string
}