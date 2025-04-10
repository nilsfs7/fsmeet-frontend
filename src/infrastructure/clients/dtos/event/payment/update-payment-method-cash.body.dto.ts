export class UpdatePaymentMethodCashBodyDto {
  enabled: boolean;

  constructor(enabled: boolean) {
    this.enabled = enabled;
  }
}
