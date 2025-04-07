export interface IConfirmPaymentUseCase {
  execute(paymentIntentId: string): Promise<boolean>;
}
