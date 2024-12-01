import { Gender } from '@/domain/enums/gender';
import { UserType } from '@/domain/enums/user-type';

export class CreateUserBodyDto {
  username: string;
  type: UserType;
  email: string;
  password: string;
  firstName: string;
  gender: Gender;

  constructor(username: string, type: UserType, email: string, password: string, firstName: string, gender: Gender) {
    this.username = username;
    this.type = type;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.gender = gender;
  }
}
