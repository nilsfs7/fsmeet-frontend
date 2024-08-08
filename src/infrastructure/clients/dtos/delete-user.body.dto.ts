export class DeleteUserBodyDto {
  username: string;

  constructor(username: string) {
    this.username = username;
  }
}
