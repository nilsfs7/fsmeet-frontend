export class ReadStripeCheckoutResponseDto {
  stripeAccountId: string;
  checkoutUrl: string | null;
  clientSecret: string | null;

  constructor(stripeAccountId: string, checkoutUrl: string | null, clientSecret: string | null) {
    this.stripeAccountId = stripeAccountId;
    this.checkoutUrl = checkoutUrl;
    this.clientSecret = clientSecret;
  }
}
