import { IClient } from "../../models/client";
import { IUser } from "../../models/user-base";
import { IVendor } from "../../models/vendor";
import { UserDetailsInput, UsersFilterInput } from "./types/admin.types";
import { PaginatedResponse } from "./types/common.types";

export interface IGetUsersUsecase {
  getUsers(input: UsersFilterInput): Promise<PaginatedResponse<IUser>>;
}

export interface IGetUsersStrategy {
  getUsers(input: UsersFilterInput): Promise<PaginatedResponse<IUser>>;
}

export interface IGetUserDetailsUsecase {
  getUserDetail(input: UserDetailsInput): Promise<IUser>;
}

export interface IGetUserDetailsStrategy {
  getDetails(input: UserDetailsInput): Promise<IUser>;
}

export interface IGetVendorRequestUsecase {
  getVendorRequests(input : UsersFilterInput): Promise<PaginatedResponse<IVendor>>
}