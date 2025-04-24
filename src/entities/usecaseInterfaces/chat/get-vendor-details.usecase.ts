import { IVendorEntity } from "../../models/vendor.entity";

export interface IGetVendorDetailsForChatUseCase {
  execute(vendorId: any): Promise<IVendorEntity | null>;
}
