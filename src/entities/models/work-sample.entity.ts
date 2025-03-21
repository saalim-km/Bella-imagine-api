import { ObjectId } from "mongoose";

export interface IWorkSampleEntity {
    vendorId: ObjectId;
    category: ObjectId;
    serviceId?: ObjectId;
    title: string;
    description: string;
    media: string[];
    tags?: string[];
    likes?: ObjectId[];
    likeCount?: number;
    comments?: {
        client: ObjectId;
        text: string;
        createdAt?: Date;
    }[];
    sharedBy?: ObjectId[];
    shareCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}