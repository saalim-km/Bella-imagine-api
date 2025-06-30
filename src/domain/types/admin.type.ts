import { FilterQuery } from "mongoose";
import { ICategory } from "../models/category";
import { IUser } from "../models/user-base";
import { IClient } from "../models/client";
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

export interface DashBoardStatsOuput {
    totalClients: number
    totalVendors: number;
    totalBookings: number;
    totalPosts: number;
    topPhotographers: {
        bookingCount: number;
        vendorId: string;
        name: string;
        profileImage: string;
    }[]
    bookingTrends: {
        count: number;
        month: string
    }[]
    newUsersTrend:         {
            count: number;
            month: string;
        }[]
    recentUsers: Partial<IClient>[]
    recentBookings:         {
            _id: string;
            userId: {
                _id: string;
                name: string;
                email: string
            },
            vendorId: {
                _id: string;
                name: string;
                email: string;
            },
            serviceDetails: {
                serviceTitle: string
            },
            totalPrice: string
            paymentStatus: string
            status: string
            createdAt: string
        }[]
    recentPosts:         {
            _id: string;
            communityId: {
                _id: string;
                name: string
            },
            userId: {
                _id: string;
                name: string;
                profileImage: string
            }
            userType: string;
            title: string
            content: string;
            mediaType: string;
            likeCount: number;
            commentCount: number;
            createdAt: string
        }[]
    postDistribution: [
        {
            count: number;
            mediaType: string
        },
        {
            count: number;
            mediaType: string
        }
    ]
}