export class CreateSponsorBodyDto {
  eventId: string;
  name: string;
  website: string;

  constructor(eventId: string, name: string, website: string) {
    this.eventId = eventId;
    this.name = name;
    this.website = website;
  }
}
