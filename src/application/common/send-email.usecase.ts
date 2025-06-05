import { inject, injectable } from "tsyringe";
import { IEmailService } from "../../domain/interfaces/service/email-service.interface";
import { SendEmailInput } from "../../domain/interfaces/usecase/types/common.types";
import { ISendEmailUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";

@injectable()
export class SendEmailUsecase implements ISendEmailUsecase {
  constructor(
    @inject("IEmailService") private _emailService: IEmailService
  ) {}

  async sendEmail(payload: SendEmailInput): Promise<void> {
    const {html , subject , to} = payload;
    await this._emailService.send(to,subject,html);
  }
}
