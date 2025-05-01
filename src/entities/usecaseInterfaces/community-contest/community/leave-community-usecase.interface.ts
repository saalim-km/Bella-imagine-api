export interface ILeaveCommunityUsecase {
    execute(communityId: string, userId: string): Promise<void>;

}