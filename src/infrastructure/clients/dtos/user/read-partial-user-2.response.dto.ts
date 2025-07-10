import { Gender } from '@/domain/enums/gender';

export class ReadPartialUser2ResponseDto {
  username: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  country: string;

  constructor(username: string, imageUrl: string, firstName: string, lastName: string, gender: Gender, country: string) {
    this.username = username;
    this.imageUrl = imageUrl;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.country = country;
  }
}
