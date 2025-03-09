import { IClientEntity } from "../../../entities/models/client.entity";
import { IVendorEntity } from "../../../entities/models/vendor.entity";
import { LoginUserDto } from "../../../shared/dtos/user.dto";

export interface ILoginStrategy<T extends IClientEntity = IClientEntity>  {
    login(data : LoginUserDto) : Promise<T | null>
}