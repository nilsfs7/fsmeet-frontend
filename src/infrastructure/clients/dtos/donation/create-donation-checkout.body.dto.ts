export class CreateDonationCheckoutBodyDto {
  amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }
}
