import Stripe from "stripe";
import { IPaymentService } from "../../entities/services/stripe-service.interface";
import { IWebHookUseCase } from "../../entities/usecaseInterfaces/payment/handle-webhook-usecase.interafec";
import { config } from "../../shared/config";
import { inject, injectable } from "tsyringe";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";

@injectable()
export class WebHookUseCase implements IWebHookUseCase {
  private stripe: Stripe;
  private endpointSecret: string;

  constructor(
    @inject("IPaymentService") private paymentService: IPaymentService
  ) {
    console.log("in webhook handle usecase");
    this.stripe = new Stripe(config.stripe.STRIPE_SECRET_KEY, {
      apiVersion: "2025-03-31.basil",
    });
    this.endpointSecret = config.stripe.STRIPE_SECRET_KEY;
  }

  async execute(sig: string, body: any): Promise<void> {
    let event: Stripe.Event;
    try {
      const payload = body instanceof Buffer ? body.toString() : body;

      event = this.stripe.webhooks.constructEvent(
        payload,
        sig,
        this.endpointSecret
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      throw new CustomError(
        "Invalid webhook signature",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    await this.paymentService.handleWebhookEvent(event);
  }
}
