export class CreatePaymentMethodSepaBodyDto {
  enabled: boolean;
  bank: string;
  recipient: string;
  iban: string;
  reference: string;

  constructor(enabled: boolean, bank: string, recipient: string, iban: string, reference: string) {
    this.enabled = enabled;
    this.bank = bank;
    this.recipient = recipient;
    this.iban = iban;
    this.reference = reference;
  }
}
