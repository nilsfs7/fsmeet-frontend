export class CreateUserConfirmBodyDto {
  requestToken: string;

  constructor(requestToken: string) {
    this.requestToken = requestToken;
  }
}
