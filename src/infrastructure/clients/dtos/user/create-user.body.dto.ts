import { Gender } from '@/domain/enums/gender';
import { UserType } from '@/domain/enums/user-type';

export class CreateUserBodyDto {
  username: string;
  type: UserType;
  email: string;
  password: string;
  firstName: string;
  gender?: Gender;
  countryCode?: string;

  constructor(username: string, type: UserType, email: string, password: string, firstName: string, gender?: Gender, countryCode?: string) {
    this.username = username;
    this.type = type;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.gender = gender;
    this.countryCode = countryCode;
  }
}
