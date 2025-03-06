import { LoginUserDto } from "../../../shared/dtos/user.dto";
import { IClientEntity } from "../../models/client.entity";

export interface ILogUseCaseIninterface {
    execute(user : LoginUserDto) : Promise<IClientEntity>
}