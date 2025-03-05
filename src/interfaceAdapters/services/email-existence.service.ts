import { injectable } from "tsyringe";
import { IEmailExistenceService } from "../../entities/services/email-existence-service.interface";
import { ClientModel } from "../../frameworks/database/models/client.model";

@injectable()
export class EmailExistenceService implements IEmailExistenceService {
    async emailExist(email: string): Promise<boolean> {
        const isExists = await ClientModel.findOne({email})
        return isExists ? true : false;
    }
}