import mongoose, { Schema } from "mongoose";
import { IContestModel } from "../models/contest.model";

export const contestSchema = new mongoose.Schema<IContestModel>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    contestType: {
        type: String,
        enum : ['weekly','monthly','yearly'],
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    vendorParticipants : {
        type : [mongoose.Types.ObjectId],
        default : [],
        ref : 'vendor'
    },
    clientParticipants : {
        type : [mongoose.Types.ObjectId],
        default : [],
        ref : 'client'
    },
    status : {
        type : String,
        enum : ['active', 'upcoming', 'ended'],
        default : 'upcoming'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
},{timestamps : true});