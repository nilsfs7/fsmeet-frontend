import { Gender } from '@/domain/enums/gender';
import { UpdatePrivateUserInfoBodyDto } from './update-private-user-info.body.dto';

export class UpdateUserBodyDto {
  username: string;
  firstName: string;
  lastName: string;
  nickName: string;
  gender: Gender;
  country: string;
  freestyleSince: number;
  instagramHandle: string;
  tikTokHandle: string;
  youTubeHandle: string;
  website: string;
  private: UpdatePrivateUserInfoBodyDto;

  constructor(
    username: string,
    firstName: string,
    lastName: string,
    nickName: string,
    gender: Gender,
    country: string,
    freestyleSince: number,
    instagramHandle: string,
    tikTokHandle: string,
    youTubeHandle: string,
    website: string,
    privateUserInfo: UpdatePrivateUserInfoBodyDto
  ) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
    this.gender = gender;
    this.country = country;
    this.freestyleSince = freestyleSince;
    this.instagramHandle = instagramHandle;
    this.tikTokHandle = tikTokHandle;
    this.youTubeHandle = youTubeHandle;
    this.website = website;
    this.private = privateUserInfo;
  }
}
