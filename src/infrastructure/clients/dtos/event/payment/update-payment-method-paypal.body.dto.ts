export class UpdatePaymentMethodPayPalBodyDto {
  enabled: boolean;
  payPalHandle: string;

  constructor(enabled: boolean, payPalHandle: string) {
    this.enabled = enabled;
    this.payPalHandle = payPalHandle;
  }
}
