export class License {
  username: string;
  amountEventLicenses: number;

  constructor(username: string, amountEventLicenses: number) {
    this.username = username;
    this.amountEventLicenses = amountEventLicenses;
  }
}
