export interface IUpdateUserStatusUsecase {
    execute(userType:string,userId : string):Promise<void>
}