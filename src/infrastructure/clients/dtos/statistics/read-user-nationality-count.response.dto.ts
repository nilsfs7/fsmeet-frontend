export class ReadUserNationalityCountResponseDto {
  countryCode: string;
  userCount: number;

  constructor(countryCode: string, userCount: number) {
    this.countryCode = countryCode;
    this.userCount = userCount;
  }
}
