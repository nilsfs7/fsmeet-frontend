export class CreatePushNotificationBodyDto {
  token: string;
  title: string;
  message: string;
  action: string;
  arbitraryData?: Record<string, string>;

  constructor(token: string, title: string, message: string, action: string, arbitraryData?: Record<string, string>) {
    this.token = token;
    this.title = title;
    this.message = message;
    this.action = action;
    this.arbitraryData = arbitraryData;
  }
}
