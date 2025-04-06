export class CreatePaymentMethodStripeBodyDto {
  enabled: boolean;
  coverProviderFee: boolean;

  constructor(enabled: boolean, coverProviderFee: boolean) {
    this.enabled = enabled;
    this.coverProviderFee = coverProviderFee;
  }
}
