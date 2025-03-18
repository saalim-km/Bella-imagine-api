import { UpdateVendorDto } from "../../../shared/dtos/user.dto";
import { IVendorEntity } from "../../models/vendor.entity";

export interface IUpdateVendorProfileUsecase {
    execute(id : any , data ?: UpdateVendorDto) : Promise<void>
}