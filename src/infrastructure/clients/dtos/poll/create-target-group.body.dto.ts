export class CreateTargetGroupBodyDto {
  maxAge: number | null;
  countryCode: string | null;

  constructor(maxAge: number | null, countryCode: string | null) {
    this.maxAge = maxAge;
    this.countryCode = countryCode;
  }
}
