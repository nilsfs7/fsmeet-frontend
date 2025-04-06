export class UpdatePaymentMethodStripeBodyDto {
  enabled: boolean;

  constructor(enabled: boolean) {
    this.enabled = enabled;
  }
}
