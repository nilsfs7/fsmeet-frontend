export class ReadUserNationalityCountResponseDto {
  country: string;
  userCount: number;

  constructor(country: string, userCount: number) {
    this.country = country;
    this.userCount = userCount;
  }
}
