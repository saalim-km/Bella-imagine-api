import { IClient } from "../../models/client";
import { IUser } from "../../models/user-base";
import { IVendor } from "../../models/vendor";
import { UserDetailsInput, UsersFilterInput, UserStrategyFilterInput, VendorRequestFilterInput } from "./types/admin.types";
import { PaginatedResponse } from "./types/common.types";

export interface IGetUsersUsecase {
  getUsers(input: UsersFilterInput): Promise<PaginatedResponse<IUser>>;
}

export interface IGetUsersStrategy<T> {
  getUsers(input: UserStrategyFilterInput): Promise<PaginatedResponse<T>>;
}

export interface IGetUserDetailsUsecase {
  getUserDetail(input: UserDetailsInput): Promise<IUser>;
}

export interface IGetUserDetailsStrategy {
  getDetails(input: UserDetailsInput): Promise<IUser>;
}

export interface IGetVendorRequestUsecase {
  getVendorRequests(input : VendorRequestFilterInput): Promise<PaginatedResponse<IVendor>>
}