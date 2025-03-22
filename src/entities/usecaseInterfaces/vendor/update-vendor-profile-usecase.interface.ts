import { UpdateVendorDto } from "../../../shared/dtos/user.dto";

export interface IUpdateVendorProfileUsecase {
    execute(id : any , data ?: UpdateVendorDto) : Promise<void>
}