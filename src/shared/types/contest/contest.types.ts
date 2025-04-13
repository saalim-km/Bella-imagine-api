import { IContest } from "../../../entities/models/contenst.entity";

export type TContest = "weekly" | "monthly" | "yearly";

export type TContestStatus = "active" | "upcoming" | "ended";

export interface UpdateContestDto {
  contestId: string;
  data: Partial<IContest>;
}

export interface PaginatedRequestContest {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}
