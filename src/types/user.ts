import { Gender } from './enums/gender';
import { UserType } from './enums/user-type';
import { UserVerificationState } from './enums/user-verification-state';

export type User = {
  username: string;
  type?: UserType;
  imageUrl?: string;
  firstName?: string;
  lastName?: string;
  nickName?: string;
  gender?: Gender;
  country?: string;
  instagramHandle?: string;
  tikTokHandle?: string;
  youTubeHandle?: string;
  website?: string;
  verificationState?: UserVerificationState;
  tShirtSize?: string;
  houseNumber?: string;
  street?: string;
  postCode?: string;
  city?: string;
  exposeLocation?: boolean;
  locLatitude?: number;
  locLongitude?: number;
};
