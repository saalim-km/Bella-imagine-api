import { injectable } from "tsyringe";
import { IEmailExistenceService } from "../../entities/services/email-existence-service.interface";
import { ClientModel } from "../../frameworks/database/models/client.model";
import { VendorModel } from "../../frameworks/database/models/vendor.model";

@injectable()
export class EmailExistenceService implements IEmailExistenceService {
    async emailExist(email: string): Promise<boolean> {
        const isExistClient = await ClientModel.findOne({email})
        const isExsistVendor = await VendorModel.findOne({email})
        if(isExistClient || isExsistVendor) {
            return true
        }else {
            return false
        }
    }
}