export class ReadStripeLoginLinkResponseDto {
  loginUrl: string;

  constructor(loginUrl: string) {
    this.loginUrl = loginUrl;
  }
}
