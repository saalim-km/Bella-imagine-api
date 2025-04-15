import mongoose from "mongoose";
import { IContestParticipateModel } from "../models/participate-contest.model";

export const participateContestSchema = new mongoose.Schema<IContestParticipateModel>({
    title: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    contestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contest',
        required: true,
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    comment: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    }],
},{timestamps : true})