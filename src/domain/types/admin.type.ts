import { FilterQuery } from "mongoose";
import { ICategory } from "../models/category";
import { IUser } from "../models/user-base";
export interface PaginationQuery<T = any> {
    filter : FilterQuery<T>
    limit : number;
    skip : number;
    sort ?: number
}

export interface GetCategoryInput extends PaginationQuery<ICategory> {}

export interface GetQueryInput extends PaginationQuery<IUser> {
}

export interface GetCatRequestInput extends Pick<PaginationQuery , 'limit' | 'skip'> {}