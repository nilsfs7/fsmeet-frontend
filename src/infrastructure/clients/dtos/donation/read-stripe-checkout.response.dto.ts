export class ReadStripeCheckoutResponseDto {
  stripeAccountId: string;
  clientSecret: string;

  constructor(stripeAccountId: string, clientSecret: string) {
    this.stripeAccountId = stripeAccountId;
    this.clientSecret = clientSecret;
  }
}
