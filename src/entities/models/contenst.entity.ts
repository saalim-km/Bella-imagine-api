import { ObjectId } from "mongoose";
import { TContest } from "../../shared/types/contest/contest.types";

export interface IContest {
    _id?: string;
    title : string;
    description: string;
    contestType: TContest;
    categoryId: ObjectId | string;
    startDate : Date;
    endDate : Date;
    vendorParticipants: string[];
    clientParticipants: string[];
    featured?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}