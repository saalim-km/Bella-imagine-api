import { TRole } from "../../../shared/constants";

export interface IForgotPassWordSendOtpUsecase {
    execute(email : string , userType : TRole): Promise<void>
}