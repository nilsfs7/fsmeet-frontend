export class CreateStripeCheckoutLinkBodyDto {
  successUrl: string;

  constructor(successUrl: string) {
    this.successUrl = successUrl;
  }
}
