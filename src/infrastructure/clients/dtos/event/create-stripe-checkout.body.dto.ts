export class CreateStripeCheckoutBodyDto {
  successUrl: string;

  constructor(successUrl: string) {
    this.successUrl = successUrl;
  }
}
