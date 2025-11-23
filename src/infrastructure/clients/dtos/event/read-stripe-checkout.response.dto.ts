export class ReadStripeCheckoutResponseDto {
  stripeAccountId: string;
  checkoutUrl: string | null;
  piClientSecret: string | null;

  constructor(stripeAccountId: string, checkoutUrl: string | null, piClientSecret: string | null) {
    this.stripeAccountId = stripeAccountId;
    this.checkoutUrl = checkoutUrl;
    this.piClientSecret = piClientSecret;
  }
}
