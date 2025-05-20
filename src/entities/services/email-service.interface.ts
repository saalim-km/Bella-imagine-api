export interface IEmailService {
    sendEmail(to: string, subject: string , html: string): Promise<void>;
}