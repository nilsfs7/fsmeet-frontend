import { Gender } from '@/domain/enums/gender';
import { UserType } from '@/domain/enums/user-type';

export class ReadPartialUser2ResponseDto {
  username: string;
  type: UserType;
  imageUrl: string;
  firstName: string;
  lastName: string;
  nickName: string;
  gender: Gender;
  country: string;
  age: number;

  constructor(username: string, type: UserType, imageUrl: string, firstName: string, lastName: string, nickName: string, gender: Gender, country: string, age: number) {
    this.username = username;
    this.type = type;
    this.imageUrl = imageUrl;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
    this.gender = gender;
    this.country = country;
    this.age = age;
  }
}
