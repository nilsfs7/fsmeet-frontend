export class ReadStripeCheckoutResponseDto {
  checkoutUrl: string | null;
  piClientSecret: string | null;

  constructor(checkoutUrl: string | null, piClientSecret: string | null) {
    this.checkoutUrl = checkoutUrl;
    this.piClientSecret = piClientSecret;
  }
}
