import mongoose, { Document } from "mongoose";
import { IContestUploadEntity } from "../../../entities/models/contest-upload.entity";
import { participateContestSchema } from "../schemas/participate-contest.schema";

export interface IContestParticipateModel extends Omit<IContestUploadEntity,"_id"> ,Document {}

export const ContestUploadModel = mongoose.model<IContestParticipateModel>('Participant',participateContestSchema)