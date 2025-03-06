import { userDTO } from "../../../shared/dtos/user.dto";

export interface IRegisterUsecase {
    execute(user : Partial<userDTO>) : Promise<void>
}