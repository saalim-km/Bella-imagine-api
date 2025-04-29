export interface IDeleteCommunityUsecase {
    execute(communityId : string) : Promise<void>
}