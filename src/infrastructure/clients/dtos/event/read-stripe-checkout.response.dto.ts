export class ReadStripeCheckoutResponseDto {
  stripeAccountId: string;
  checkoutUrl: string | null;
  clientSecret: string | null;
  /** Some endpoints return a payment-intent client secret under this key. */
  piClientSecret: string | null;

  constructor(
    stripeAccountId: string,
    checkoutUrl: string | null,
    clientSecret: string | null,
    piClientSecret: string | null = null,
  ) {
    this.stripeAccountId = stripeAccountId;
    this.checkoutUrl = checkoutUrl;
    this.clientSecret = clientSecret;
    this.piClientSecret = piClientSecret;
  }
}
