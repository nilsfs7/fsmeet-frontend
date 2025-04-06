export class CreatePaymentMethodStripeBodyDto {
  enabled: boolean;

  constructor(enabled: boolean) {
    this.enabled = enabled;
  }
}
