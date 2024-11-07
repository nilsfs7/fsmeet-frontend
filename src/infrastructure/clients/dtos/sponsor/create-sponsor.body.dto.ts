export class CreateSponsorBodyDto {
  eventId: string;
  name: string;
  website: string;
  isPublic: boolean;

  constructor(eventId: string, name: string, website: string, isPublic: boolean) {
    this.eventId = eventId;
    this.name = name;
    this.website = website;
    this.isPublic = isPublic;
  }
}
