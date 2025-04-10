export class CreatePaymentMethodCashBodyDto {
  enabled: boolean;

  constructor(enabled: boolean) {
    this.enabled = enabled;
  }
}
