import { UpdateCommunityDto } from "../../../../shared/types/community/community.types";
import { ICommunityEntity } from "../../../models/community.entity";

export interface IUpdateCommunityUsecase {
    execute(dto: UpdateCommunityDto) : Promise<void>
} 