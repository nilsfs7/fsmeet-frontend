export class ReadStripeCheckoutResponseDto {
  stripeAccountId: string;
  piClientSecret: string;

  constructor(stripeAccountId: string, piClientSecret: string) {
    this.stripeAccountId = stripeAccountId;
    this.piClientSecret = piClientSecret;
  }
}
