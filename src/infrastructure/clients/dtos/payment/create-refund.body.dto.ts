export class CreateRefundBodyDto {
  intentId: string;

  constructor(intentId: string) {
    this.intentId = intentId;
  }
}
