import { injectable } from "tsyringe";
import { ISendEmailUsecase } from "../../domain/interfaces/usecase/auth-usecase-interfaces";

@injectable()
export class SendOtpUsecase implements ISendEmailUsecase {
    constructor(
        
    ){}
    async sendEmail(email: string): Promise<void> {
        
    }
}   