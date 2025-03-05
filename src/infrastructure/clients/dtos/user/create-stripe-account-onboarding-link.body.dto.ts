export class CreateStripeAccountOnboardingLinkBodyDto {
  refreshUrl: string;
  returnUrl: string;

  constructor(refreshUrl: string, returnUrl: string) {
    this.refreshUrl = refreshUrl;
    this.returnUrl = returnUrl;
  }
}
