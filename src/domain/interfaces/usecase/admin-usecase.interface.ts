import { Types } from "mongoose";
import { ICategory } from "../../models/category";
import { IUser } from "../../models/user-base";
import { IVendor } from "../../models/vendor";
import { CreateNewCategoryInput, GetCategoriesFilterInput, getCatJoinRequestInput, UpdateCategory, UpdateUserStatusInput, UpdateVendorRequestInput, UserDetailsInput, UsersFilterInput, UserStrategyFilterInput, UupdateCatReqInput, VendorRequestFilterInput } from "./types/admin.types";
import { PaginatedResponse } from "./types/common.types";
import { ICategoryRequest } from "../../models/category-request";

export interface IGetUsersUsecase {
  getUsers(input: UsersFilterInput): Promise<PaginatedResponse<Partial<IUser>>>
}

export interface IGetUsersStrategy<T = IUser> {
  getUsers(input: UserStrategyFilterInput): Promise<PaginatedResponse<Partial<T>>>;
}

export interface IGetUserDetailsUsecase {
  getUserDetail(input: UserDetailsInput): Promise<Partial<IUser>> ;
}

export interface IGetUserDetailsStrategy<T = IUser> {
  getDetails(input: UserDetailsInput): Promise<Partial<T>>;
}

export interface IGetVendorRequestUsecase {
  getVendorRequests(input : VendorRequestFilterInput): Promise<PaginatedResponse<Partial<IVendor>>>
}

export interface IUserManagementUsecase {
  updateBlockStatus(input : UpdateUserStatusInput) : Promise<void>
  updateVendorRequest(input : UpdateVendorRequestInput) : Promise<void>
}

export interface ICategoryManagementUsecase {
  createNewCategory(input : CreateNewCategoryInput) : Promise<void>
  getCategories(input : GetCategoriesFilterInput): Promise<PaginatedResponse<Partial<ICategory>>>
  updateCategory(input : UpdateCategory) : Promise<void>
  updateCategoryStatus(categoryId : Types.ObjectId) : Promise<void> 
  getCatJoinRequest(input : getCatJoinRequestInput) : Promise<PaginatedResponse<ICategoryRequest>>
  updateCatJoinRequest(input : UupdateCatReqInput) : Promise<void> 
  getCatForUsers() : Promise<PaginatedResponse<ICategory>>
}

export interface IDashboardUsecase {
  fetchDashBoardStats() : Promise<any>
}