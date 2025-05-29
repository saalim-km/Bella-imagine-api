import { RegisterUserInput } from "../../../application/auth/auth.types";
import { TRole } from "../../../shared/constants/constants";

export interface ISendAuthEmailUsecase {
    sendAuthEmail(email : string , userRole : TRole): Promise<void>
}

export interface IRegisterUserUsecase {
    register(input : RegisterUserInput) :  Promise<void>
}

export interface IVendorRegisterStrategy {
    register(input : RegisterUserInput) : Promise<void>
}

export interface IClientRegisterStrategy {
    register(input : RegisterUserInput) : Promise<void>
}

