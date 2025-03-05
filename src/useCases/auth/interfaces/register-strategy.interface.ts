import { IClientEntity } from "../../../entities/models/client.entity";
import { IVendorEntity } from "../../../entities/models/vendor.entity";
import { userDTO } from "../../../shared/dtos/user.dto";

export interface IRegisterStrategy<T extends IClientEntity = IClientEntity> {
    register(user : T): Promise<T>;
}