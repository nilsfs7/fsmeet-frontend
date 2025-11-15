export class CreateBroadcastBodyDto {
  title: string;
  message: string;

  constructor(title: string, message: string) {
    this.title = title;
    this.message = message;
  }
}
