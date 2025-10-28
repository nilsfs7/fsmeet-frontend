export class CreatePushNotificationBodyDto {
  token: string;
  title: string;
  message: string;
  type: string;
  arbitraryData?: Record<string, string>;

  constructor(token: string, title: string, message: string, type: string, arbitraryData?: Record<string, string>) {
    this.token = token;
    this.title = title;
    this.message = message;
    this.type = type;
    this.arbitraryData = arbitraryData;
  }
}
