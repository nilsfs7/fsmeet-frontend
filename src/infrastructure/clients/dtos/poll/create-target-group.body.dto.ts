export class CreateTargetGroupBodyDto {
  maxAge: number | null;
  country: string | null;

  constructor(maxAge: number | null, country: string | null) {
    this.maxAge = maxAge;
    this.country = country;
  }
}
