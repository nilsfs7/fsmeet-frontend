export class CreateVisaInvitationRequestBodyDto {
  firstName: string;
  lastName: string;
  countryCode: string;
  passportNumber: string;

  constructor(firstName: string, lastName: string, countryCode: string, passportNumber: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.countryCode = countryCode;
    this.passportNumber = passportNumber;
  }
}
