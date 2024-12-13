export class ReadPartialUser1ResponseDto {
  username: string;
  imageUrl: string;
  firstName: string;
  lastName: string;

  constructor(username: string, imageUrl: string, firstName: string, lastName: string) {
    this.username = username;
    this.imageUrl = imageUrl;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
