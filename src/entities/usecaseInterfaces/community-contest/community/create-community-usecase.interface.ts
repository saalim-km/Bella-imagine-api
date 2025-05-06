import { CreateCommunityDto } from "../../../../shared/types/community/community.types";

export interface ICreateCommunityUsecase {
    execute(dto : CreateCommunityDto) : Promise<void>
}