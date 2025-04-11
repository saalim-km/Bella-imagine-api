import mongoose, { ObjectId } from "mongoose";
import { IContest } from "../../../entities/models/contenst.entity";
import { contestSchema } from "../schemas/contest.schema";

export interface IContestModel extends IContest , Document {}

export const ContestModel = mongoose.model('Contest',contestSchema)