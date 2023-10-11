export type PaymentMethodSepa = {
  enabled: boolean;
  bank: string;
  recipient: string;
  iban: string;
  reference: string;
};
