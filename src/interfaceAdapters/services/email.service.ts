import { injectable } from "tsyringe";
import nodemailer from "nodemailer";
import { IEmailService } from "../../domain/interfaces/service/email-service.interface";
import { config } from "../../shared/config/config";

@injectable()
export class EmailService implements IEmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.nodemailer.USER,
        pass: config.nodemailer.PASS,
      },
    });
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: `"Bella Imagine" <${config.nodemailer.USER}>`,
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}