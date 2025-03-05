import { userDTO } from "../../../shared/dtos/user.dto";
import { IClientEntity } from "../../models/client.entity";

export interface IRegisterUsecase {
    execute(user : Partial<userDTO>) : Promise<void>
}