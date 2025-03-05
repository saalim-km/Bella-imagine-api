import { injectable } from "tsyringe";
import nodemailer from 'nodemailer'
import { IEmailService } from "../../entities/services/email-service.interface";
import { VERIFICATION_MAIL_CONTENT } from "../../shared/constants";
import { config } from "../../shared/config";

@injectable()
export class EmailService implements IEmailService {
    private transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service : "gmail",
            auth : {
                user : config.nodemailer.USER,
                pass : config.nodemailer.PASS
            }
        })
    }
    async sendEmail(to: string, subject: string, otp : string): Promise<void> {
        const mailOption = {
            from : 'Bella Imagine',
            to,
            subject,
            html : VERIFICATION_MAIL_CONTENT(otp)
        }

        await this.transporter.sendMail(mailOption);
    }
}