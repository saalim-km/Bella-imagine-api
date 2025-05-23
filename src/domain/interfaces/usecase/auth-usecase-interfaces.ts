export interface ISendEmailUsecase {
    sendEmail(email: string): Promise<void>
}