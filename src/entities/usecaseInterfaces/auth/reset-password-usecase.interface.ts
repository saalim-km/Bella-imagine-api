import { TRole } from "../../../shared/constants";

export interface IResetPasswordUsecase {
    execute({email,userType,newPassword} : {email : string,userType : TRole , newPassword : string}):Promise<void>
}