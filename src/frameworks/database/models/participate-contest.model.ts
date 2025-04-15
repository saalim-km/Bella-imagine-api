import { Document } from "mongoose";
import { IContestUploadEntity } from "../../../entities/models/contest-upload.entity";

export interface IContestParticipateModel extends Omit<IContestUploadEntity,"_id"> ,Document {}