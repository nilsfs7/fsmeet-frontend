import { ShowExperience } from '@/domain/enums/show-experience';
import { Moment } from 'moment';

export class UpdatePrivateUserInfoBodyDto {
  birthday: Moment;
  tShirtSize: string;
  houseNumber: string;
  street: string;
  postCode: string;
  city: string;
  exposeLocation: boolean;
  locLatitude: number;
  locLongitude: number;
  jobAcceptTerms: boolean;
  jobOfferShows: boolean;
  jobOfferWalkActs: boolean;
  jobOfferWorkshops: boolean;
  jobShowExperience: ShowExperience;
  phoneCountryCode: number;
  phoneNumber: string;
  preferredLanguageCode: string;

  constructor(
    birthday: Moment,
    tShirtSize: string,
    houseNumber: string,
    street: string,
    postCode: string,
    city: string,
    exposeLocation: boolean,
    locLatitude: number,
    locLongitude: number,
    jobAcceptTerms: boolean,
    jobOfferShows: boolean,
    jobOfferWalkActs: boolean,
    jobOfferWorkshops: boolean,
    jobShowExperience: ShowExperience,
    phoneCountryCode: number,
    phoneNumber: string,
    preferredLanguageCode: string,
  ) {
    this.birthday = birthday;
    this.tShirtSize = tShirtSize;
    this.houseNumber = houseNumber;
    this.street = street;
    this.postCode = postCode;
    this.city = city;
    this.exposeLocation = exposeLocation;
    this.locLatitude = locLatitude;
    this.locLongitude = locLongitude;
    this.jobAcceptTerms = jobAcceptTerms;
    this.jobOfferShows = jobOfferShows;
    this.jobOfferWalkActs = jobOfferWalkActs;
    this.jobOfferWorkshops = jobOfferWorkshops;
    this.jobShowExperience = jobShowExperience;
    this.phoneCountryCode = phoneCountryCode;
    this.phoneNumber = phoneNumber;
    this.preferredLanguageCode = preferredLanguageCode;
  }
}
